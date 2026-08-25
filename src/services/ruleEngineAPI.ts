/**
 * Rule Engine API — applicable models, attributes, rules, conditions, actions.
 *
 * Naming is the thing to keep straight, because three ids are in play and the
 * backend is picky about which goes where:
 *
 *   AvailableModel   — the catalogue row for a table   (available_model_id)
 *   ApplicableModel  — that model enabled for a tenant (applicable model id)
 *   lock_model_name  — the real class/table name
 *
 * A condition stores the APPLICABLE model id in `condition_selected_model`
 * (Executor#applicable_rules matches on applicable-model ids), while an action
 * stores the AVAILABLE model id in `action_selected_model` plus the applicable
 * id in `rule_engine_applicable_model_id`. Crossing these produces a rule that
 * saves cleanly and never fires.
 *
 * Display names are for the UI only; every value written back is the original
 * `attribute_name` / `lock_model_name`.
 */
import { getFullUrl, getAuthHeader } from "@/config/apiConfig";

// ── Operators ─────────────────────────────────────────────────────────────
// RuleEngine::Condition declares `enum operator: { equals: 0, not_equals: 1,
// greater_than: 2, less_than: 3 }` and Executor#compare returns false for
// anything else, so these four are the whole set. Do not add to this list
// without adding the matching branch in lib/rule_engine/executor.rb.
export const OPERATORS = [
  { value: "equals", label: "equals", symbol: "=" },
  { value: "not_equals", label: "not equals", symbol: "≠" },
  { value: "greater_than", label: "greater than", symbol: ">" },
  { value: "less_than", label: "less than", symbol: "<" },
] as const;

export const operatorSymbol = (value: string) =>
  OPERATORS.find((o) => o.value === value)?.symbol ?? value;

/**
 * Executor#conditions_met? partitions on `condition_type` — everything that is
 * not "OR" counts as AND. All ANDs must pass and at least one OR must pass.
 */
export const CONDITION_TYPES = [
  { value: "AND", label: "AND — all must match" },
  { value: "OR", label: "OR — any may match" },
] as const;

/**
 * Filters which rules run for a given trigger:
 * Executor#applicable_rules does `where(action_type: [@action_type, nil])`.
 */
export const ACTION_TYPES = [
  { value: "created", label: "On create" },
  { value: "updated", label: "On update" },
] as const;

// ── Types ─────────────────────────────────────────────────────────────────

/** A model enabled for the tenant — the only model picker in this UI. */
export interface ApplicableModel {
  /** ApplicableModel id — goes into a condition's condition_selected_model. */
  id: number;
  /** AvailableModel id — goes into an action's action_selected_model, and is
   *  what the attributes endpoint is keyed on. */
  availableModelId: number;
  displayName: string;
  /** Real class/table name — goes into an action's lock_model_name. */
  lockModelName: string;
  type: string | null;
  /** The data source this model was pulled from. Null for internal models. */
  datasourceId: number | null;
  active: boolean;
}

/** Just enough of a data source to label it in a picker. */
export interface DataSourceOption {
  id: number;
  name: string;
}

export interface AttributeOption {
  id: number;
  /** Original column name — this is what a condition stores. */
  attributeName: string;
  displayName: string;
}

export interface RuleCondition {
  id?: number;
  conditionAttribute: string;
  operator: string;
  compareValue: string;
  /** ApplicableModel id. */
  conditionSelectedModel: number | null;
  conditionType: string;
  actionType: string;
  /** Read-only label the rules API sends back. */
  modelName?: string;
}

export interface RuleAction {
  id?: number;
  lockModelName: string;
  /** Method invoked on the model. Free text — see Action#execute in the app. */
  actionMethod: string;
  /** AvailableModel id. */
  actionSelectedModel: number | null;
  applicableModelId: number | null;
  parameters: string[];
}

export interface Rule {
  id: number;
  name: string;
  description: string;
  active: boolean;
  modelId: number | null;
  companyId: number | null;
  userId: number | null;
  createdAt: string | null;
  conditions: RuleCondition[];
  actions: RuleAction[];
}

// ── Fetch plumbing ────────────────────────────────────────────────────────

const headers = (json = false) => {
  const base: Record<string, string> = {
    Authorization: getAuthHeader(),
    Accept: "application/json",
  };
  if (json) base["Content-Type"] = "application/json";
  return base;
};

const readJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

/** Prefers the server's own message over a bare status code. */
const errorText = (body: any, fallback: string) =>
  body?.message ||
  body?.error ||
  (Array.isArray(body?.errors) && body.errors.length
    ? body.errors.join(", ")
    : null) ||
  fallback;

const request = async (
  path: string,
  init?: RequestInit,
  fallback = "Request failed"
) => {
  const response = await fetch(getFullUrl(path), init);
  // DELETE endpoints answer 204 with no body.
  const body = response.status === 204 ? null : await readJson(response);
  if (!response.ok) {
    throw new Error(errorText(body, `${fallback} (${response.status})`));
  }
  return body;
};

const asArray = (body: any, ...keys: string[]): any[] => {
  if (Array.isArray(body)) return body;
  for (const key of keys) if (Array.isArray(body?.[key])) return body[key];
  return [];
};

const str = (value: unknown) => String(value ?? "").trim();

const num = (value: unknown): number | null =>
  value === null || value === undefined || value === "" ? null : Number(value);

// ── Catalogue reads ───────────────────────────────────────────────────────

/** GET /datasources.json — names for the data source picker. */
export const fetchDataSources = async (): Promise<DataSourceOption[]> => {
  const body = await request(
    "/datasources.json",
    { headers: headers() },
    "Failed to load data sources"
  );

  return asArray(body, "datasources", "data")
    .map((row: any) => ({
      id: Number(row?.id),
      name: str(row?.datasource_name) || `Data source #${row?.id}`,
    }))
    .filter((d) => Number.isFinite(d.id));
};

/**
 * GET /rule_engine/available_models/:id.json
 *
 * One catalogue row, for resolving which data source a model belongs to. The
 * rules API returns only `model_id`, so opening an existing rule needs this to
 * work out which data source to preselect — without it the only alternative is
 * pulling the whole unfiltered model list.
 */
export const fetchAvailableModelDatasource = async (
  availableModelId: number
): Promise<number | null> => {
  const body = await request(
    `/rule_engine/available_models/${availableModelId}.json`,
    { headers: headers() },
    "Failed to resolve the model's data source"
  );
  return num(body?.datasource_id);
};

/**
 * GET /rule_engine/applicable_models/tenant_models.json?datasource_id=
 *
 * The model dropdown. Sourced from the applicable models — what this tenant may
 * actually build rules on — not from the raw catalogue.
 *
 * Callers pass a datasourceId so the list is scoped to one source. Omitting it
 * returns every applicable model, which the canvas deliberately never does.
 */
export const fetchApplicableModels = async (
  datasourceId?: number | string
): Promise<ApplicableModel[]> => {
  const query = datasourceId ? `?datasource_id=${datasourceId}` : "";
  const body = await request(
    `/rule_engine/applicable_models/tenant_models.json${query}`,
    { headers: headers() },
    "Failed to load models"
  );

  return asArray(body, "models", "tenant_models", "data")
    .map((row: any) => ({
      id: Number(row?.id),
      availableModelId: Number(row?.available_model_id),
      lockModelName: str(row?.lock_model_name),
      displayName: str(row?.display_name) || str(row?.lock_model_name),
      type: row?.type ?? null,
      datasourceId: num(row?.datasource_id),
      active: row?.active !== false,
    }))
    .filter(
      (m) => Number.isFinite(m.id) && Number.isFinite(m.availableModelId)
    );
};

/** GET /rule_engine/available_attributes/dropdown.json?available_model_id= */
export const fetchAttributes = async (
  availableModelId: number
): Promise<AttributeOption[]> => {
  const body = await request(
    `/rule_engine/available_attributes/dropdown.json?available_model_id=${availableModelId}`,
    { headers: headers() },
    "Failed to load attributes"
  );

  return asArray(body, "attributes", "data")
    .map((row: any) => ({
      id: Number(row?.id),
      attributeName: str(row?.attribute_name),
      displayName: str(row?.display_name) || str(row?.attribute_name),
    }))
    .filter((a) => a.attributeName);
};

// ── Rules ─────────────────────────────────────────────────────────────────

const parseCondition = (row: any): RuleCondition => ({
  id: row?.id ?? undefined,
  conditionAttribute: str(row?.condition_attribute),
  operator: str(row?.operator) || "equals",
  compareValue: str(row?.compare_value),
  conditionSelectedModel: num(row?.condition_selected_model),
  conditionType: str(row?.condition_type).toUpperCase() === "OR" ? "OR" : "AND",
  actionType: str(row?.action_type) || "created",
  modelName: row?.model_name ?? undefined,
});

const parseAction = (row: any): RuleAction => ({
  id: row?.id ?? undefined,
  lockModelName: str(row?.lock_model_name),
  actionMethod: str(row?.action_method),
  actionSelectedModel: num(row?.action_selected_model),
  applicableModelId: num(row?.rule_engine_applicable_model_id),
  // json column; older rows may hold something other than an array.
  parameters: Array.isArray(row?.parameters) ? row.parameters.map(String) : [],
});

const parseRule = (row: any): Rule => ({
  id: Number(row?.id),
  name: str(row?.name),
  description: str(row?.description),
  active: Boolean(row?.active),
  modelId: num(row?.model_id),
  companyId: num(row?.company_id),
  userId: num(row?.user_id),
  createdAt: row?.created_at ?? null,
  conditions: asArray(row?.conditions).map(parseCondition),
  actions: asArray(row?.actions).map(parseAction),
});

export const fetchRules = async (): Promise<Rule[]> => {
  const body = await request(
    "/rule_engine/rules.json",
    { headers: headers() },
    "Failed to load rules"
  );
  return asArray(body, "rules", "data")
    .map(parseRule)
    .filter((r) => Number.isFinite(r.id));
};

export const fetchRule = async (id: number): Promise<Rule> => {
  const body = await request(
    `/rule_engine/rules/${id}.json`,
    { headers: headers() },
    "Failed to load rule"
  );
  return parseRule(body);
};

export interface RuleDraft {
  name: string;
  description: string;
  active: boolean;
  /** AvailableModel id — RuleEngine::Rule#available_model is keyed on model_id. */
  modelId: number | null;
  conditions: RuleCondition[];
  actions: RuleAction[];
  /** Rows removed since load — sent back as _destroy. */
  removedConditionIds?: number[];
  removedActionIds?: number[];
}

/**
 * Create and update both go through the nested-attributes form, so a rule and
 * its whole body travel in one request.
 *
 * company_id / organization_id / user_id are intentionally absent — the
 * controller stamps them from the signed-in user and no longer permits them.
 */
const buildPayload = (draft: RuleDraft) => ({
  rule_engine_rule: {
    name: draft.name,
    description: draft.description,
    active: draft.active,
    model_id: draft.modelId,
    rule_engine_conditions_attributes: [
      ...draft.conditions.map((condition) => ({
        ...(condition.id ? { id: condition.id } : {}),
        condition_attribute: condition.conditionAttribute,
        operator: condition.operator,
        compare_value: condition.compareValue,
        condition_selected_model: condition.conditionSelectedModel,
        condition_type: condition.conditionType,
        action_type: condition.actionType,
      })),
      ...(draft.removedConditionIds ?? []).map((id) => ({
        id,
        _destroy: true,
      })),
    ],
    rule_engine_actions_attributes: [
      ...draft.actions.map((action) => ({
        ...(action.id ? { id: action.id } : {}),
        lock_model_name: action.lockModelName,
        action_method: action.actionMethod,
        action_selected_model: action.actionSelectedModel,
        rule_engine_applicable_model_id: action.applicableModelId,
        parameters: action.parameters,
      })),
      ...(draft.removedActionIds ?? []).map((id) => ({ id, _destroy: true })),
    ],
  },
});

export const createRule = async (draft: RuleDraft): Promise<Rule> => {
  const body = await request(
    "/rule_engine/rules.json",
    {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify(buildPayload(draft)),
    },
    "Failed to create rule"
  );
  return parseRule(body);
};

export const updateRule = async (
  id: number,
  draft: RuleDraft
): Promise<Rule> => {
  const body = await request(
    `/rule_engine/rules/${id}.json`,
    {
      method: "PUT",
      headers: headers(true),
      body: JSON.stringify(buildPayload(draft)),
    },
    "Failed to update rule"
  );
  return parseRule(body);
};

export const deleteRule = (id: number) =>
  request(
    `/rule_engine/rules/${id}.json`,
    { method: "DELETE", headers: headers() },
    "Failed to delete rule"
  );

// ── Conditions / actions, addressed directly ──────────────────────────────
// The canvas saves through the rule's nested attributes, so these are here for
// reading a rule's rows back and for deleting one outside a full save.

/** GET /rule_engine/conditions.json?rule_engine_rule_id= */
export const fetchConditions = async (
  ruleId: number
): Promise<RuleCondition[]> => {
  const body = await request(
    `/rule_engine/conditions.json?rule_engine_rule_id=${ruleId}`,
    { headers: headers() },
    "Failed to load conditions"
  );
  return asArray(body, "conditions", "data").map(parseCondition);
};

/** GET /rule_engine/actions.json?rule_engine_rule_id= */
export const fetchActions = async (ruleId: number): Promise<RuleAction[]> => {
  const body = await request(
    `/rule_engine/actions.json?rule_engine_rule_id=${ruleId}`,
    { headers: headers() },
    "Failed to load actions"
  );
  return asArray(body, "actions", "data").map(parseAction);
};

export const deleteCondition = (id: number) =>
  request(
    `/rule_engine/conditions/${id}.json`,
    { method: "DELETE", headers: headers() },
    "Failed to delete condition"
  );

export const deleteAction = (id: number) =>
  request(
    `/rule_engine/actions/${id}.json`,
    { method: "DELETE", headers: headers() },
    "Failed to delete action"
  );
