import React, { useState, useEffect, useRef } from "react";

type Visitor = {
  id: number;
  apiId?: number; // Actual ID from API response for delete operations
  contact?: string;
  name?: string;
  email?: string;
  vehicle?: "car" | "bike" | null;
  vehicleNumber?: string;
};

const VisitorSharingFormWeb: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [ndaAgree, setNdaAgree] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoChanged, setProfilePhotoChanged] =
    useState<boolean>(false);
  const [profilePhotoError, setProfilePhotoError] = useState<boolean>(false);
  // Camera state for Step 1 image capture
  const [showCameraModal, setShowCameraModal] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = React.useRef<number | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiConsentHtml, setApiConsentHtml] = useState<string | null>(null);
  const apiErrorTimerRef = React.useRef<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // when the server indicates the form was already submitted (approve: 5)
  // we show only a centered card and hide the rest of the UI
  const [alreadySubmitted, setAlreadySubmitted] = useState<boolean>(false);
  // when user navigates from Preview via an Edit button, remember to return to Preview
  const [returnToPreviewOnNext, setReturnToPreviewOnNext] =
    useState<boolean>(false);

  const showToast = (msg: string, duration = 3000) => {
    // clear any existing timer
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    setToastVisible(true);
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
      toastTimerRef.current = null;
    }, duration);
  };
  // Basic form state (missing from earlier edits)
  type Asset = {
    id: number;
    category?: string;
    name?: string;
    serial?: string;
    notes?: string;
    attachments?: { name: string; url: string; file?: File }[];
  };

  type IdentityPayload = {
    identity_type?: string;
    government_id_number?: string;
    documents?: File[];
  };

  // documents can be File or an object with a .file property when prefilling from API
  type DocumentLike = File | { name?: string; url?: string; file?: File };

  type VisitorPayload = {
    // allow mapping of additional visitor fields too
    name?: string;
    mobile?: string;
    email?: string;
    vehicle_number?: string;
    guest_vehicle_type?: string;
    vehicle_type?: string;
    guest_type?: string;
    guest_number?: string;
    guest_name?: string;
    guest_email?: string;
    guest_vehicle_number?: string;
    expected_at?: string;
    visit_purpose?: string;
    company_name?: string;
    visit_to?: string;
    persont_to_meet?: string;
    plus_person?: number;
    notes?: string;
    pass_holder?: string;
    pass_start_date?: string;
    pass_end_date?: string;
    pass_days?: string[];
    assets?: Array<{
      asset_category_name?: string;
      asset_name?: string;
      serial_model_number?: string;
      notes?: string;
      documents?: File[];
      attachments?: { name?: string; url?: string; file?: File }[];
    }>;
    identity?: IdentityPayload;
  };

  const [guestType, setGuestType] = useState<"Once" | "Frequent">("Once");
  const [contact, setContact] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [expectedDate, setExpectedDate] = useState<string>("");
  const [expectedTime, setExpectedTime] = useState<string>("");
  const [fromTime, setFromTime] = useState<string>("");
  const [toTime, setToTime] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [personToMeet, setPersonToMeet] = useState<string>("myself");
  const [personToMeetName, setPersonToMeetName] = useState<string>("");
  const [toLocation, setToLocation] = useState<string>("");

  const [primaryVehicle, setPrimaryVehicle] = useState<"car" | "bike" | null>(
    null
  );
  const [primaryVehicleNumber, setPrimaryVehicleNumber] = useState<string>("");

  // Extra fields populated from API response
  const [passHolder, setPassHolder] = useState<boolean | null>(null);
  const [passStartDate, setPassStartDate] = useState<string | null>(null);
  const [passEndDate, setPassEndDate] = useState<string | null>(null);
  const [passDays, setPassDays] = useState<string[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  // token and visitor id from URL
  const [urlToken, setUrlToken] = useState<string | null>(null);
  const [urlVisitorId, setUrlVisitorId] = useState<string | null>(null);
  // encrypted id returned by the GET prefill API (preferred when present)
  const [prefillEncryptedId, setPrefillEncryptedId] = useState<string | null>(
    null
  );

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [newlyAddedVisitorIds, setNewlyAddedVisitorIds] = useState<Set<number>>(new Set());
  const [visitorErrors, setVisitorErrors] = useState<
    Record<number, { contact: boolean; name: boolean; vehicleNumber: boolean }>
  >({});
  const [primaryVehicleError, setPrimaryVehicleError] =
    useState<boolean>(false);

  const [assetsByVisitor, setAssetsByVisitor] = useState<
    Record<number, Asset[]>
  >({});
  const [carryingAsset, setCarryingAsset] = useState<boolean>(false);
  const [expandedVisitors, setExpandedVisitors] = useState<
    Record<number, boolean>
  >({ 0: false });
  // Step 3 asset errors: true means at least one required asset field missing
  const [assetCategoryErrors, setAssetCategoryErrors] = useState<
    Record<number, boolean>
  >({});

  // DEBUG: log assets state when it changes to help diagnose prefill visibility
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug("[state] assetsByVisitor:", assetsByVisitor);
    // eslint-disable-next-line no-console
    console.debug(
      "[state] carryingAsset:",
      carryingAsset,
      "expandedVisitors:",
      expandedVisitors
    );
  }, [assetsByVisitor, carryingAsset, expandedVisitors]);

  // cleanup camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  // helper to open the camera modal and request camera permissions/stream
  const openCamera = async () => {
    setShowCameraModal(true);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      showToast(
        "Unable to access camera. Please allow camera permission or use Upload."
      );
    }
  };

  // Prefill Step 1 from host API (image upload intentionally excluded)
  useEffect(() => {
    // extract token from query and id from path
    const params =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;
    const token = params ? params.get("token") : null;
    let id: string | null = null;
    if (typeof window !== "undefined") {
      const parts = window.location.pathname.split("/").filter(Boolean);
      if (parts.length) id = parts[parts.length - 1];
    }
    setUrlToken(token);
    setUrlVisitorId(id);

    if (!id || !token) {
      // missing values; prefill is optional
      return;
    }

    const loadPrefill = async () => {
      try {
        const res = await fetch(
          `https://lockated-api.gophygital.work/pms/visitors/${id}/visitor_show.json?token=${encodeURIComponent(token)}`
        );
        if (!res.ok) {
          // surface server errors to the small mobile card for easier debugging
          setApiError(`Prefill failed (${res.status})`);
          return;
        }
        const data = await res.json();
        // If the GET prefill response contains an encrypted visitor id, save it
        // so we can prefer it for the update call later (authoritative).
        try {
          const possibleId =
            (data && (data.visitor_encrypted_id || data.encrypted_id || data.id || data.visitor_id)) ||
            null;
          if (possibleId) setPrefillEncryptedId(String(possibleId));
        } catch (_) {
          // ignore
        }
        // DEBUG: log consent form payload so we can confirm shape
        if (typeof console !== "undefined" && console.warn) {
          // cast to Record to avoid `any` lint rule
          console.warn(
            "[prefill] visitor_consent_form:",
            (data as Record<string, unknown>)?.visitor_consent_form
          );
        }
        try {
          const vcf = (data as Record<string, unknown>)
            ?.visitor_consent_form as unknown;
          if (vcf) {
            // If the consent form is a string, use it directly.
            if (typeof vcf === "string") {
              setApiConsentHtml(String(vcf));
            } else if (typeof vcf === "object" && vcf !== null) {
              // Narrow to an object and safely read possible fields.
              const obj = vcf as Record<string, unknown>;
              const descVal = obj.description ?? obj.value ?? obj.html ?? null;
              if (typeof descVal === "string") {
                setApiConsentHtml(descVal);
              } else if (descVal != null) {
                // Fallback: coerce non-string values to string if present.
                setApiConsentHtml(String(descVal));
              }
            }
          }
        } catch (_) {
          // ignore malformed consent payload
        }
        // Map common host fields into the Step 1 state
        if (data.guest_type) setGuestType(data.guest_type);
        if (data.guest_number) setContact(String(data.guest_number));
        else if (data.mobile) setContact(String(data.mobile));

        if (data.guest_name) setName(String(data.guest_name));
        else if (data.name) setName(String(data.name));

        if (data.guest_email) setEmail(String(data.guest_email));
        else if (data.email) setEmail(String(data.email));
        if (data.expected_at) {
          const [d, t, a] = String(data.expected_at).split(" ");
          if (d) setExpectedDate(d);
          if (t) setExpectedTime(t + " " + a);
        }
        if (data.visit_purpose) setPurpose(String(data.visit_purpose));
        if (data.company_name) setCompany(String(data.company_name));
        // prefer guest_from if provided by host API, otherwise fall back to visit_to
        const guestFrom = (data as Record<string, unknown>)?.guest_from;
        if (typeof guestFrom !== "undefined" && guestFrom !== null) {
          setLocation(String(guestFrom));
        } else if (data.visit_to) {
          setLocation(String(data.visit_to));
        }
        // Also prefill the Step 2 "to location" field from the host API's visit_to when available
        if (data.visit_to) {
          setToLocation(String(data.visit_to));
        }
        // Debug: log the host-provided location fields so we can verify why both may be identical
        if (data.persont_to_meet)
          setPersonToMeetName(String(data.persont_to_meet));

        if (data.guest_vehicle_number)
          setPrimaryVehicleNumber(String(data.guest_vehicle_number));

        // map vehicle type into primaryVehicle state if provided
        const primaryVt = data.guest_vehicle_type || data.vehicle_type || "";
        if (primaryVt) {
          const vt = String(primaryVt).toLowerCase();
          if (vt.includes("car")) setPrimaryVehicle("car");
          else if (
            vt.includes("bike") ||
            vt.includes("motor") ||
            vt.includes("two")
          )
            setPrimaryVehicle("bike");
        }

        if (typeof data.pass_holder !== "undefined")
          setPassHolder(Boolean(data.pass_holder));
        if (data.pass_start_date)
          setPassStartDate(String(data.pass_start_date));
        if (data.pass_end_date) setPassEndDate(String(data.pass_end_date));
        if (Array.isArray(data.pass_days))
          setPassDays(data.pass_days.map(String));
        if (data.qr_code_url) setQrCodeUrl(String(data.qr_code_url));
        if (data.notes) setNotes(String(data.notes));

        // Prefill profile photo when API returns `image` (string URL or object)
        if (data.image) {
          let imageUrl: string | undefined;
          if (typeof data.image === "string") imageUrl = data.image;
          else if (data.image && typeof data.image === "object") {
            const imgObj = data.image as Record<string, unknown>;
            imageUrl =
              typeof imgObj.url === "string"
                ? imgObj.url
                : typeof imgObj.image_url === "string"
                  ? imgObj.image_url
                  : typeof imgObj.document_url === "string"
                    ? imgObj.document_url
                    : typeof imgObj.file_url === "string"
                      ? imgObj.file_url
                      : undefined;
          }
          if (imageUrl) setProfilePhoto(String(imageUrl));
        }

        if (data.visitor_identity) {
          type DocShape = {
            name?: string;
            url?: string;
            document_url?: string;
            documentUrl?: string;
            file_url?: string;
          };
          setIdentityByVisitor((s) => ({
            ...s,
            0: {
              type: data.visitor_identity.identity_type,
              govId: data.visitor_identity.government_id_number,
              photoCount: 0,
              documents: (data.visitor_identity.documents || []).map(
                (d: DocShape) => ({
                  name: d.name || undefined,
                  url: d.url || d.document_url || d.documentUrl || d.file_url,
                })
              ),
            },
          }));
        }

        // If the host response indicates the form was already submitted,
        // show only the small card and skip the rest of the prefill mapping.
        const maybeApprove = (data as Record<string, unknown>)?.approve;
        if (typeof maybeApprove !== "undefined" && Number(maybeApprove) === 5) {
          setAlreadySubmitted(true);
          return;
        }

        // Map primary assets (always) from host response so Step 3 shows prefilled assets
        try {
          const maybeAssetsPrimary = (data as unknown as { assets?: unknown })
            .assets;
          if (Array.isArray(maybeAssetsPrimary) && maybeAssetsPrimary.length) {
            const canonicalizeCategory = (raw: unknown) => {
              if (!raw) return "";
              const s = String(raw).trim();
              const lower = s.toLowerCase();
              const known = [
                "it",
                "mechanical",
                "electrical",
                "furniture",
                "other",
                "tool",
                "electronics",
              ];
              const found = known.find((k) => lower.includes(k));
              if (found)
                return found === "it"
                  ? "IT"
                  : found[0].toUpperCase() + found.slice(1);
              return s;
            };
            const primaryArr: Asset[] = [];
            for (let ai = 0; ai < maybeAssetsPrimary.length; ai++) {
              const a = maybeAssetsPrimary[ai] as
                | Record<string, unknown>
                | undefined;
              if (!a) continue;
              const docs = Array.isArray(a.documents)
                ? (a.documents as unknown[])
                : [];
              const attachments = docs.map((d) => {
                const dd = d as Record<string, unknown> | undefined;
                return {
                  name: typeof dd?.name === "string" ? dd!.name : undefined,
                  url:
                    typeof dd?.document_url === "string"
                      ? dd!.document_url
                      : typeof dd?.url === "string"
                        ? dd!.url
                        : typeof dd?.file_url === "string"
                          ? dd!.file_url
                          : undefined,
                };
              });
              primaryArr.push({
                id: typeof a.id === "number" ? a.id : ai,
                category: canonicalizeCategory(
                  a.asset_category_name || a.asset_category || ""
                ),
                name: typeof a.asset_name === "string" ? a.asset_name : "",
                serial:
                  typeof a.serial_model_number === "string"
                    ? a.serial_model_number
                    : "",
                notes: typeof a.notes === "string" ? a.notes : "",
                attachments,
              });
            }
            if (primaryArr.length) {
              // Merge with any existing primary assets so we don't drop File objects
              setAssetsByVisitor((s) => {
                const prev = Array.isArray(s[0]) ? s[0] : [];
                const merged = primaryArr.map((a, idx) => {
                  const prevA = prev[idx];
                  if (
                    prevA &&
                    Array.isArray(prevA.attachments) &&
                    Array.isArray(a.attachments)
                  ) {
                    const mergedAttachments = a.attachments!.map((att, ai) => {
                      const prevAtt = prevA.attachments![ai];
                      const file = prevAtt && (prevAtt as { file?: File }).file;
                      return file ? { ...att, file } : att;
                    });
                    return { ...a, attachments: mergedAttachments };
                  }
                  return a;
                });
                return { ...s, 0: merged };
              });
              setCarryingAsset(true);
              setExpandedVisitors((s) => ({ ...s, 0: true }));
              // debug
              // eslint-disable-next-line no-console
              console.debug("[prefill-primary] primaryArr:", primaryArr);
            }
          }
        } catch (err) {
          // best-effort
        }

        if (
          Array.isArray(data.additional_visitors) &&
          data.additional_visitors.length
        ) {
          type AddVis = {
            mobile?: string;
            guest_number?: string;
            name?: string;
            guest_name?: string;
            email?: string;
            guest_email?: string;
            vehicle_number?: string;
            guest_vehicle_number?: string;
            vehicle_type?: string;
            guest_vehicle_type?: string;
          };
          const mapped = data.additional_visitors.map(
            (av: AddVis, idx: number) => {
              // detect vehicle type variants
              const vtRaw = (av.vehicle_type ||
                av.guest_vehicle_type ||
                "") as string;
              let vehicle: "car" | "bike" | null = null;
              if (vtRaw) {
                const vt = String(vtRaw).toLowerCase();
                if (vt.includes("car")) vehicle = "car";
                else if (
                  vt.includes("bike") ||
                  vt.includes("motor") ||
                  vt.includes("two")
                )
                  vehicle = "bike";
              }
              return {
                id: idx + 1,
                apiId: (av as Record<string, unknown>)?.id as number | undefined,
                contact: av.mobile || av.guest_number || "",
                name: av.name || av.guest_name || "",
                email: av.email || av.guest_email || "",
                vehicle,
                vehicleNumber:
                  av.vehicle_number || av.guest_vehicle_number || "",
              };
            }
          );
          setVisitors(mapped);
          // Clear newly added visitors set since we're loading pre-filled ones
          setNewlyAddedVisitorIds(new Set());
          // Map identity for additional visitors (so Step 4 shows gov id and photos)
          try {
            const identitiesMap: Record<number, IdentityState> = {};
            const addVisArr = Array.isArray(
              (data as unknown as { additional_visitors?: unknown })
                .additional_visitors
            )
              ? (data as unknown as { additional_visitors?: unknown })
                .additional_visitors
              : [];
            (addVisArr as unknown[]).forEach((avUnknown, idx: number) => {
              const id = idx + 1; // matches visitors[] mapping (primary = 0)
              if (!avUnknown || typeof avUnknown !== "object") return;
              const av = avUnknown as Record<string, unknown>;
              const identity = (av.identity || av.visitor_identity) as
                | Record<string, unknown>
                | undefined;
              if (!identity) return;
              const docsArr = Array.isArray(identity.documents)
                ? identity.documents
                : [];
              const documents = (docsArr as unknown[])
                .map((dUnknown) => {
                  if (!dUnknown || typeof dUnknown !== "object")
                    return undefined;
                  const d = dUnknown as Record<string, unknown>;
                  const url =
                    typeof d.document_url === "string"
                      ? d.document_url
                      : typeof d.url === "string"
                        ? d.url
                        : typeof d.documentUrl === "string"
                          ? d.documentUrl
                          : typeof d.file_url === "string"
                            ? d.file_url
                            : undefined;
                  if (!url) return undefined;
                  return {
                    name: typeof d.name === "string" ? d.name : "",
                    url,
                  };
                })
                .filter(Boolean) as { name: string; url: string }[];

              const gov =
                typeof identity.government_id_number === "string"
                  ? identity.government_id_number
                  : undefined;
              const idType =
                typeof identity.identity_type === "string"
                  ? identity.identity_type
                  : undefined;
              if (documents.length || gov || idType) {
                identitiesMap[id] = {
                  type: idType as IdentityState["type"] | undefined,
                  govId: gov,
                  photoCount: documents.length,
                  documents: documents,
                };
              }
            });
            if (Object.keys(identitiesMap).length) {
              setIdentityByVisitor((s) => ({ ...s, ...identitiesMap }));
            }
          } catch (_) {
            // best-effort mapping
          }
          // Map assets from the host response into our assetsByVisitor state so
          // Step 3 shows prefilled assets and their document URLs.
          try {
            const assetsMap: Record<number, Asset[]> = {};

            const maybeAssets = (data as unknown as { assets?: unknown })
              .assets;
            if (Array.isArray(maybeAssets) && maybeAssets.length) {
              // additional visitor assets handled below
            }

            const maybeAdditional = (
              data as unknown as {
                additional_visitors?: unknown;
              }
            ).additional_visitors;
            if (Array.isArray(maybeAdditional)) {
              for (let avIdx = 0; avIdx < maybeAdditional.length; avIdx++) {
                const av = maybeAdditional[avIdx] as
                  | Record<string, unknown>
                  | undefined;
                if (!av) continue;
                const maybeAvAssets = av.assets;
                if (!Array.isArray(maybeAvAssets) || !maybeAvAssets.length)
                  continue;
                const arr: Asset[] = [];
                for (let ai = 0; ai < maybeAvAssets.length; ai++) {
                  const a = maybeAvAssets[ai] as
                    | Record<string, unknown>
                    | undefined;
                  if (!a) continue;
                  const docs = Array.isArray(a.documents)
                    ? (a.documents as unknown[])
                    : [];
                  const attachments = docs.map((d) => {
                    const dd = d as Record<string, unknown> | undefined;
                    return {
                      name: typeof dd?.name === "string" ? dd!.name : undefined,
                      url:
                        typeof dd?.document_url === "string"
                          ? dd!.document_url
                          : typeof dd?.url === "string"
                            ? dd!.url
                            : typeof dd?.file_url === "string"
                              ? dd!.file_url
                              : undefined,
                    };
                  });
                  arr.push({
                    id: typeof a.id === "number" ? a.id : ai,
                    category:
                      typeof a.asset_category_name === "string"
                        ? a.asset_category_name
                        : typeof a.asset_category === "string"
                          ? a.asset_category
                          : "",
                    name: typeof a.asset_name === "string" ? a.asset_name : "",
                    serial:
                      typeof a.serial_model_number === "string"
                        ? a.serial_model_number
                        : "",
                    notes: typeof a.notes === "string" ? a.notes : "",
                    attachments,
                  });
                }
                if (arr.length) assetsMap[avIdx + 1] = arr;
              }
            }

            if (Object.keys(assetsMap).length) {
              // merge incoming assets with existing state to preserve File objects
              setAssetsByVisitor((s) => {
                const next = { ...s };
                Object.keys(assetsMap).forEach((k) => {
                  const id = Number(k);
                  if (Number.isNaN(id)) return;
                  const incoming = assetsMap[id] || [];
                  const prev = Array.isArray(s[id]) ? s[id] : [];
                  const merged = incoming.map((a, idx) => {
                    const prevA = prev[idx];
                    if (
                      prevA &&
                      Array.isArray(prevA.attachments) &&
                      Array.isArray(a.attachments)
                    ) {
                      const mergedAttachments = a.attachments!.map(
                        (att, ai) => {
                          const prevAtt = prevA.attachments![ai];
                          const file =
                            prevAtt && (prevAtt as { file?: File }).file;
                          return file ? { ...att, file } : att;
                        }
                      );
                      return { ...a, attachments: mergedAttachments };
                    }
                    return a;
                  });
                  next[id] = merged;
                });
                return next;
              });
              // mark carryingAsset true when any assets were prefilled
              setCarryingAsset(true);
              // expand visitor sections that have prefilled assets so users see them
              setExpandedVisitors((s) => {
                const next = { ...s };
                Object.keys(assetsMap).forEach((k) => {
                  const id = Number(k);
                  if (!Number.isNaN(id)) next[id] = true;
                });
                return next;
              });
              // DEBUG: output prefilled assets and expansion state
              // eslint-disable-next-line no-console
              console.debug("[prefill] assetsMap:", assetsMap);
              // eslint-disable-next-line no-console
              console.debug(
                "[prefill] carryingAsset=true, expandedVisitors (will update):",
                Object.keys(assetsMap).map((k) => Number(k))
              );
            }
          } catch (err) {
            // swallow mapping errors; prefill is best-effort
          }
        }
      } catch (e) {
        // show a brief API error card on network failure
        setApiError("Prefill network error");
      }
    };
    loadPrefill();
  }, []);

  // Step 4 identity per visitor
  type IdentityState = {
    type?: "PAN" | "Aadhaar" | "Passport" | "Driving License";
    govId?: string;
    photoCount?: number;
    documents?: { name: string; url: string; file?: File }[];
  };
  const [identityByVisitor, setIdentityByVisitor] = useState<
    Record<number, IdentityState>
  >({});
  const [identityErrors, setIdentityErrors] = useState<Record<number, boolean>>(
    {}
  );

  // Delete primary visitor: clear primary fields and assets
  const removePrimaryVisitor = () => {
    setContact("");
    setName("");
    setEmail("");
    setExpectedDate("");
    setExpectedTime("");
    setPurpose("");
    setCompany("");
    setLocation("");
    setPersonToMeet("myself");
    setPersonToMeetName("");
    setToLocation("");
    setPrimaryVehicle(null);
    setPrimaryVehicleNumber("");
    setAssetsByVisitor((s) => ({ ...s, 0: [] }));
    setExpandedVisitors((e) => ({ ...e, 0: false }));
  };

  const addVisitor = () => {
    const nextId = visitors.length ? visitors[visitors.length - 1].id + 1 : 1;
    setVisitors((v) => [
      ...v,
      {
        id: nextId,
        contact: "",
        name: "",
        email: "",
        vehicle: null,
        vehicleNumber: "",
      },
    ]);
    // Track this as a newly added visitor
    setNewlyAddedVisitorIds((prev) => new Set([...prev, nextId]));
  };

  const removeVisitor = async (id: number) => {
    // If it's a newly added visitor, just remove from state without API call
    if (newlyAddedVisitorIds.has(id)) {
      setVisitors((v) => v.filter((x) => x.id !== id));
      setNewlyAddedVisitorIds((prev) => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
      return;
    }

    // For pre-filled visitors, call the delete API
    if (!urlToken || !urlVisitorId) {
      showToast("Missing token or visitor ID");
      return;
    }

    // Find the visitor to get the API ID
    const visitor = visitors.find((v) => v.id === id);
    if (!visitor || !visitor.apiId) {
      showToast("Unable to delete visitor - API ID not found");
      return;
    }

    try {
      const apiUrl = `https://lockated-api.gophygital.work/pms/visitors/${visitor.apiId}/delete_additional_visitor.json?token=${encodeURIComponent(
        urlToken
      )}`;

      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete visitor: ${response.statusText}`);
      }

      // Remove from state after successful API call
      setVisitors((v) => v.filter((x) => x.id !== id));
      showToast("Visitor deleted successfully");
    } catch (error) {
      console.error("Error deleting visitor:", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to delete visitor"
      );
    }
  };

  const updateVisitor = (id: number, patch: Partial<Visitor>) =>
    setVisitors((v) => v.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  // Next navigation with validations for specific steps
  const handleNext = () => {
    // Step 2: require Contact Number and Vehicle Number for each additional visitor
    // Step 1: require profile photo upload
    if (step === 1) {
      const missingPhoto = !profilePhoto;
      setProfilePhotoError(missingPhoto);
      if (missingPhoto) {
        showToast("Please upload a profile photo to continue.");
        return;
      }
    }

    if (step === 2) {
      const errs: Record<
        number,
        { contact: boolean; name: boolean; vehicleNumber: boolean }
      > = {};
      let hasErrors = false;
      visitors.forEach((vis) => {
        const contactMissing = !(vis.contact || "").trim();
        const nameMissing = !(vis.name || "").trim();
        // Vehicle number is mandatory only if a vehicle type is selected for the visitor
        const vehicleRequired = !!vis.vehicle;
        const vehicleMissing =
          vehicleRequired && !(vis.vehicleNumber || "").trim();
        if (contactMissing || nameMissing || vehicleMissing) hasErrors = true;
        errs[vis.id] = {
          contact: contactMissing,
          name: nameMissing,
          vehicleNumber: vehicleMissing,
        };
      });
      // Primary vehicle number is mandatory only if a primary vehicle is selected
      const primaryMissing = !!primaryVehicle && !primaryVehicleNumber.trim();
      setVisitorErrors(errs);
      setPrimaryVehicleError(primaryMissing);
      if (hasErrors || primaryMissing) {
        showToast("Please fill all required visitor fields before proceeding.");
        return;
      }
    }

    // NDA gating (step 5 -> step 6)
    if (step === 5 && !ndaAgree) {
      showToast("Please agree to the NDA to continue.");
      return;
    }

    // Step 3: require Asset details for primary and all additional visitors only when carryingAsset is true
    if (step === 3) {
      if (carryingAsset) {
        let hasAssetErrors = false;
        const nextErrors: Record<number, boolean> = {};
        // Validate primary visitor (id: 0) and any visitor entries that exist
        const allVisitors = [0, ...visitors.map((v) => v.id)];
        allVisitors.forEach((id) => {
          const list = assetsByVisitor[id] || [];
          const first = list[0];
          const category = first?.category || "";
          const name = first?.name || "";
          const serial = first?.serial || "";

          // Required fields: Category, Asset Name, Serial No.
          const missingCategory = !category.trim();
          const missingName = !name.trim();
          const missingSerial = !serial.trim();

          const missingAny = missingCategory || missingName || missingSerial;

          nextErrors[id] = missingAny;
          if (missingAny) hasAssetErrors = true;
        });
        setAssetCategoryErrors(nextErrors);
        if (hasAssetErrors) {
          showToast(
            "Please fill Asset Category, Asset Name and Serial No. for all visitors."
          );
          // expand the visitor sections that have missing categories
          setExpandedVisitors((e) => {
            const next = { ...e };
            Object.keys(nextErrors).forEach((k) => {
              const id = Number(k);
              if (nextErrors[id]) next[id] = true;
            });
            return next;
          });

          // scroll to the first failing visitor after the DOM updates
          const firstFailKey = Object.keys(nextErrors).find(
            (k) => nextErrors[Number(k)]
          );
          if (firstFailKey) {
            const failId = Number(firstFailKey);
            // give React a tick to apply expanded state
            setTimeout(() => {
              const el = document.getElementById(`asset-visitor-${failId}`);
              if (el && typeof el.scrollIntoView === "function") {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }, 60);
          }
          return;
        }
      } else {
        // when not carrying assets, clear any previous asset errors and allow proceeding
        setAssetCategoryErrors({});
      }
    }

    // Step 4: require identity type selection AND either an uploaded ID image OR a government ID number
    if (step === 4) {
      const errs: Record<number, boolean> = {};
      let hasMissing = false;
      const allVisitors = [0, ...visitors.map((v) => v.id)];

      allVisitors.forEach((id) => {
        const idState = identityByVisitor[id];

        const hasType = !!(idState && idState.type);

        const hasGov =
          !!idState &&
          typeof idState.govId === "string" &&
          idState.govId.trim().length > 0;

        const docs =
          idState && Array.isArray(idState.documents)
            ? idState.documents
            : [];

        // documents are stored as { name, url, file }.
        // Consider image provided if we have at least one real File OR a valid URL
        const hasImage = docs.some((d) => {
          const maybe = d as { file?: File; url?: string };
          const hasFile = maybe.file instanceof File;
          const hasUrl = typeof maybe.url === "string" && maybe.url.trim().length > 0;
          return hasFile || hasUrl;
        });

        // missing only if: no type OR (no gov id AND no file)
        const missing = !hasType || (!hasGov && !hasImage);
        errs[id] = missing;
        if (missing) hasMissing = true;
      });

      setIdentityErrors(errs);
      if (hasMissing) {
        showToast(
          "Please select an ID type and provide at least one ID image OR enter Government ID number for all visitors."
        );
        setExpandedVisitors((prev) => {
          const next = { ...prev };
          const allVisitorsLocal = [0, ...visitors.map((v) => v.id)];
          allVisitorsLocal.forEach((id) => {
            if (errs[id]) next[id] = true;
          });
          return next;
        });
        return;
      }
    }

    // If user came from Preview via an Edit button, return them to Preview on Next
    if (returnToPreviewOnNext) {
      setReturnToPreviewOnNext(false);
      setStep(6);
      return;
    }

    setStep((s) => (s === 5 ? (ndaAgree ? 6 : 5) : Math.min(6, s + 1)));
  };

  const buildVisitorFormData = ({
    primaryVisitor,
    additionalVisitors = [],
    carryingAssetFlag = false,
    imageBase64 = null,
    includeImage = false,
  }: {
    primaryVisitor: VisitorPayload;
    additionalVisitors?: VisitorPayload[];
    carryingAssetFlag?: boolean;
    imageBase64?: string | null;
    includeImage?: boolean;
  }) => {
    const formData = new FormData();

    // Track files we've already appended to avoid duplicates in multipart payloads.
    // Use name|size|lastModified as a best-effort signature.
    const seenFiles = new Set<string>();
    const fileSignature = (f: File) =>
      `${f.name}|${f.size}|${(f as File & { lastModified?: number }).lastModified ?? 0}`;
    const appendFileOnce = (key: string, f: File) => {
      try {
        const sig = fileSignature(f);
        if (seenFiles.has(sig)) return;
        seenFiles.add(sig);
      } catch (_) {
        // If anything goes wrong, fall back to appending (safer than dropping silently)
      }
      formData.append(key, f);
    };

    // include carrying asset flag (use the key spelled as requested)
    formData.append(
      "gatekeeper[carring_asset]",
      carryingAssetFlag ? "true" : "false"
    );

    // include resource id as requested (2920)
    formData.append("gatekeeper[resource_id]", "2920");

    // include profile photo when provided on Step 1
    // priority: base64 string (from uploaded File or prefetched URL) -> fallback URL
    if (includeImage) {
      if (imageBase64) {
        // server expects raw base64 (without data: prefix)
        formData.append("gatekeeper[image]", imageBase64);
      } else if (profilePhoto && typeof profilePhoto === "string") {
        // final fallback: if the prefilled photo is a URL, send it as image
        formData.append("gatekeeper[image]", profilePhoto);
      }
    }

    if (primaryVisitor.guest_type)
      formData.append("gatekeeper[guest_type]", primaryVisitor.guest_type);
    if (primaryVisitor.guest_number)
      formData.append("gatekeeper[guest_number]", primaryVisitor.guest_number);
    if (primaryVisitor.guest_name)
      formData.append("gatekeeper[guest_name]", primaryVisitor.guest_name);
    if (primaryVisitor.guest_email)
      formData.append("gatekeeper[guest_email]", primaryVisitor.guest_email);
    if (primaryVisitor.guest_vehicle_number)
      formData.append(
        "gatekeeper[guest_vehicle_number]",
        primaryVisitor.guest_vehicle_number
      );
    if (primaryVisitor.guest_vehicle_type)
      formData.append(
        "gatekeeper[vehicle_type]",
        primaryVisitor.guest_vehicle_type
      );
    formData.append("gatekeeper[approve]", "5");

    if (primaryVisitor.expected_at)
      formData.append("gatekeeper[expected_at]", primaryVisitor.expected_at);
    if (primaryVisitor.visit_purpose)
      formData.append(
        "gatekeeper[visit_purpose]",
        primaryVisitor.visit_purpose
      );
    if (primaryVisitor.company_name)
      formData.append("gatekeeper[company_name]", primaryVisitor.company_name);
    if (primaryVisitor.visit_to)
      formData.append("gatekeeper[visit_to]", primaryVisitor.visit_to);
    if (primaryVisitor.persont_to_meet)
      formData.append(
        "gatekeeper[persont_to_meet]",
        primaryVisitor.persont_to_meet
      );
    if (primaryVisitor.plus_person)
      formData.append(
        "gatekeeper[plus_person]",
        String(primaryVisitor.plus_person)
      );
    if (primaryVisitor.notes)
      formData.append("gatekeeper[notes]", primaryVisitor.notes);

    if (primaryVisitor.pass_holder)
      formData.append("gatekeeper[pass_holder]", primaryVisitor.pass_holder);
    if (primaryVisitor.pass_start_date)
      formData.append(
        "gatekeeper[pass_start_date]",
        primaryVisitor.pass_start_date
      );
    if (primaryVisitor.pass_end_date)
      formData.append(
        "gatekeeper[pass_end_date]",
        primaryVisitor.pass_end_date
      );
    (primaryVisitor.pass_days || []).forEach((d: string) =>
      formData.append("gatekeeper[pass_days][]", d)
    );

    (primaryVisitor.assets || []).forEach((a, idx: number) => {
      if (a.asset_category_name)
        formData.append(
          `gatekeeper[assets][${idx}][asset_category_name]`,
          a.asset_category_name
        );
      if (a.asset_name)
        formData.append(`gatekeeper[assets][${idx}][asset_name]`, a.asset_name);
      if (a.serial_model_number)
        formData.append(
          `gatekeeper[assets][${idx}][serial_model_number]`,
          a.serial_model_number
        );
      if (a.notes)
        formData.append(`gatekeeper[assets][${idx}][notes]`, a.notes);
      // Append attachments and documents explicitly per-item so we don't lose
      // attachments when some items have File objects and others only URLs.
      // For each attachment: if file exists append as File, otherwise append url as documents_urls[].
      (a.attachments || []).forEach((att) => {
        const file = (att as { file?: File })?.file;
        if (file instanceof File) {
          appendFileOnce(`gatekeeper[assets][${idx}][documents][]`, file);
        } else if (att && typeof att.url === "string") {
          formData.append(
            `gatekeeper[assets][${idx}][documents_urls][]`,
            att.url
          );
        }
      });
      // Also include any File objects present in a.documents (legacy shape)
      (a.documents || []).forEach((d) => {
        if (d instanceof File) {
          appendFileOnce(`gatekeeper[assets][${idx}][documents][]`, d);
        } else {
          const maybe = d as unknown as { url?: string };
          if (maybe && typeof maybe.url === "string") {
            formData.append(
              `gatekeeper[assets][${idx}][documents_urls][]`,
              maybe.url
            );
          }
        }
      });
    });

    if (primaryVisitor.identity) {
      if (primaryVisitor.identity.identity_type)
        formData.append(
          "gatekeeper[visitor_identity][identity_type]",
          primaryVisitor.identity.identity_type
        );
      if (primaryVisitor.identity.government_id_number)
        formData.append(
          "gatekeeper[visitor_identity][government_id_number]",
          primaryVisitor.identity.government_id_number
        );
      // documents may be File objects or objects like { name, url, file }
      (primaryVisitor.identity.documents || []).forEach((doc: DocumentLike) => {
        const file = doc instanceof File ? doc : (doc as { file?: File })?.file;
        if (file)
          appendFileOnce("gatekeeper[visitor_identity][documents][]", file);
      });
    }

    additionalVisitors.forEach((v, i: number) => {
      if (v.name)
        formData.append(
          `gatekeeper[additional_visitors_attributes][${i}][name]`,
          v.name
        );
      if (v.mobile)
        formData.append(
          `gatekeeper[additional_visitors_attributes][${i}][mobile]`,
          v.mobile
        );
      if (v.email)
        formData.append(
          `gatekeeper[additional_visitors_attributes][${i}][email]`,
          v.email
        );
      if (v.vehicle_number)
        formData.append(
          `gatekeeper[additional_visitors_attributes][${i}][vehicle_number]`,
          v.vehicle_number
        );
      if (v.vehicle_type)
        formData.append(
          `gatekeeper[additional_visitors_attributes][${i}][vehicle_type]`,
          v.vehicle_type
        );
      if (v.guest_type)
        formData.append(
          `gatekeeper[additional_visitors_attributes][${i}][guest_type]`,
          v.guest_type
        );
      if (v.expected_at)
        formData.append(
          `gatekeeper[additional_visitors_attributes][${i}][expected_at]`,
          v.expected_at
        );
      if (v.visit_purpose)
        formData.append(
          `gatekeeper[additional_visitors_attributes][${i}][visit_purpose]`,
          v.visit_purpose
        );
      if (v.company_name)
        formData.append(
          `gatekeeper[additional_visitors_attributes][${i}][company_name]`,
          v.company_name
        );
      if (v.visit_to)
        formData.append(
          `gatekeeper[additional_visitors_attributes][${i}][visit_to]`,
          v.visit_to
        );
      if (v.persont_to_meet)
        formData.append(
          `gatekeeper[additional_visitors_attributes][${i}][persont_to_meet]`,
          v.persont_to_meet
        );
      if (v.plus_person)
        formData.append(
          `gatekeeper[additional_visitors_attributes][${i}][plus_person]`,
          String(v.plus_person)
        );
      if (v.notes)
        formData.append(
          `gatekeeper[additional_visitors_attributes][${i}][notes]`,
          v.notes
        );

      if (v.pass_holder)
        formData.append(
          `gatekeeper[additional_visitors_attributes][${i}][pass_holder]`,
          v.pass_holder
        );
      if (v.pass_start_date)
        formData.append(
          `gatekeeper[additional_visitors_attributes][${i}][pass_start_date]`,
          v.pass_start_date
        );
      if (v.pass_end_date)
        formData.append(
          `gatekeeper[additional_visitors_attributes][${i}][pass_end_date]`,
          v.pass_end_date
        );
      (v.pass_days || []).forEach((d: string) =>
        formData.append(
          `gatekeeper[additional_visitors_attributes][${i}][pass_days][]`,
          d
        )
      );

      (v.assets || []).forEach((a, aIdx: number) => {
        if (a.asset_category_name)
          formData.append(
            `gatekeeper[additional_visitors_attributes][${i}][assets][${aIdx}][asset_category_name]`,
            a.asset_category_name
          );
        if (a.asset_name)
          formData.append(
            `gatekeeper[additional_visitors_attributes][${i}][assets][${aIdx}][asset_name]`,
            a.asset_name
          );
        if (a.serial_model_number)
          formData.append(
            `gatekeeper[additional_visitors_attributes][${i}][assets][${aIdx}][serial_model_number]`,
            a.serial_model_number
          );
        if (a.notes)
          formData.append(
            `gatekeeper[additional_visitors_attributes][${i}][assets][${aIdx}][notes]`,
            a.notes
          );
        // Append per-attachment/file for additional visitor asset
        (a.attachments || []).forEach((att) => {
          const file = (att as { file?: File })?.file;
          if (file instanceof File) {
            appendFileOnce(
              `gatekeeper[additional_visitors_attributes][${i}][assets][${aIdx}][documents][]`,
              file
            );
          } else if (att && typeof att.url === "string") {
            formData.append(
              `gatekeeper[additional_visitors_attributes][${i}][assets][${aIdx}][documents_urls][]`,
              att.url
            );
          }
        });
        (a.documents || []).forEach((d) => {
          if (d instanceof File) {
            appendFileOnce(
              `gatekeeper[additional_visitors_attributes][${i}][assets][${aIdx}][documents][]`,
              d
            );
          } else {
            const maybe = d as unknown as { url?: string };
            if (maybe && typeof maybe.url === "string") {
              formData.append(
                `gatekeeper[additional_visitors_attributes][${i}][assets][${aIdx}][documents_urls][]`,
                maybe.url
              );
            }
          }
        });
      });

      if (v.identity) {
        if (v.identity.identity_type)
          formData.append(
            `gatekeeper[additional_visitors_attributes][${i}][identity][identity_type]`,
            v.identity.identity_type
          );
        if (v.identity.government_id_number)
          formData.append(
            `gatekeeper[additional_visitors_attributes][${i}][identity][government_id_number]`,
            v.identity.government_id_number
          );
        // accept File or { name, url, file }
        (v.identity.documents || []).forEach((doc: DocumentLike) => {
          const file =
            doc instanceof File ? doc : (doc as { file?: File })?.file;
          if (file)
            appendFileOnce(
              `gatekeeper[additional_visitors_attributes][${i}][identity][documents][]`,
              file
            );
        });
      }
    });

    return formData;
  };
  // Submit built FormData to API
  const submitToApi = async () => {
    try {
      setIsSubmitting(true);
      const token = urlToken || "";
      // Prefer query param `id` -> prefillEncryptedId (from GET) -> path-derived urlVisitorId
      let visitorEncryptedId: string | null = null;
      try {
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const idFromQuery = params.get("id");
          if (idFromQuery) visitorEncryptedId = idFromQuery;
        }
      } catch (_) {
        // ignore
      }
      if (!visitorEncryptedId) visitorEncryptedId = prefillEncryptedId || urlVisitorId;

      const baseUrl = `https://lockated-api.gophygital.work/pms/visitors/${visitorEncryptedId}/update_expected_visitor.json`;
      // append token using & if baseUrl already contains query params
      const url = token
        ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}token=${encodeURIComponent(
          token
        )}`
        : baseUrl;

      const expectedIso =
        expectedDate && expectedTime
          ? `${expectedDate}T${expectedTime.replace(/\s+/g, "")}${expectedTime.match(/^\d{2}:\d{2}$/) ? ":00" : ""}`
          : "";

      const primaryVisitor: VisitorPayload = {
        // guest_type: guestType,
        // guest_number: contact,
        // guest_name: name,
        // guest_email: email,
        guest_vehicle_number: primaryVehicleNumber,
        guest_vehicle_type: primaryVehicle || undefined,
        // expected_at: expectedIso,
        // visit_purpose: purpose,
        // company_name: company,
        visit_to: location,
        // persont_to_meet: personToMeetName || "Myself",
        plus_person: visitors.length,
        notes: "",
        pass_holder: passHolder ? "true" : undefined,
        pass_start_date: passStartDate || undefined,
        pass_end_date: passEndDate || undefined,
        pass_days: passDays || [],
        // Preserve attachments objects (name/url/file) so the FormData builder
        // can either append File objects or send documents_urls fallback when
        // the File is no longer available (e.g. after a previous submit).
        assets: (assetsByVisitor[0] || []).map((a) => ({
          asset_category_name: a.category,
          asset_name: a.name,
          serial_model_number: a.serial,
          notes: a.notes,
          // keep original attachments array (may contain { name, url, file })
          documents: (a.attachments || [])
            .map((att) => att.file)
            .filter(Boolean),
        })),
        identity: identityByVisitor[0]
          ? {
            identity_type: identityByVisitor[0].type,
            government_id_number: identityByVisitor[0].govId,
            documents: (identityByVisitor[0].documents || [])
              .map((d) => d.file!)
              .filter(Boolean),
          }
          : undefined,
      };

      // Only include newly added visitors in the payload (exclude pre-filled ones)
      const additionalVisitors: VisitorPayload[] = visitors
        .filter((vis) => newlyAddedVisitorIds.has(vis.id))
        .map((vis) => ({
          name: vis.name,
          mobile: vis.contact,
          email: vis.email,
          vehicle_number: vis.vehicleNumber,
          vehicle_type: vis.vehicle || undefined,
          guest_type: "Once",
          expected_at: expectedIso,
          visit_purpose: purpose,
          company_name: company,
          visit_to: location,
          persont_to_meet: personToMeetName || "Myself",
          plus_person: 0,
          notes: "",
          pass_holder: undefined,
          pass_start_date: undefined,
          pass_end_date: undefined,
          pass_days: [],
          assets: (assetsByVisitor[vis.id] || []).map((a) => ({
            asset_category_name: a.category,
            asset_name: a.name,
            serial_model_number: a.serial,
            notes: a.notes,
            attachments: (a.attachments || []).map((att) => ({
              name: att.name,
              url: att.url,
              file: (att as { file?: File })?.file,
            })),
            documents: (a.attachments || [])
              .map((att) => att.file)
              .filter(Boolean),
          })),
          identity: identityByVisitor[vis.id]
            ? {
              identity_type: identityByVisitor[vis.id].type,
              government_id_number: identityByVisitor[vis.id].govId,
              documents: (identityByVisitor[vis.id].documents || [])
                .map((d) => d.file!)
                .filter(Boolean),
            }
            : undefined,
        }));

      // Debug: inspect state and payload shapes to ensure File objects exist
      // eslint-disable-next-line no-console
      console.debug("[submitToApi] assetsByVisitor:", assetsByVisitor);
      // eslint-disable-next-line no-console
      console.debug("[submitToApi] primaryVisitor:", primaryVisitor);
      // eslint-disable-next-line no-console
      console.debug("[submitToApi] additionalVisitors:", additionalVisitors);

      // Convert uploaded File to base64 when present; otherwise fetch the prefetched URL
      let imageBase64: string | null = null;
      const toBase64FromBlob = (blob: Blob) =>
        new Promise<string | null>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string | null;
            if (!result) return resolve(null);
            const comma = result.indexOf(",");
            resolve(comma >= 0 ? result.slice(comma + 1) : result);
          };
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        });

      try {
        if (profilePhotoFile) {
          // convert uploaded file to base64
          imageBase64 = await toBase64FromBlob(profilePhotoFile as Blob);
        } else if (profilePhoto && typeof profilePhoto === "string") {
          // fetch the URL and convert to base64 (may fail due to CORS)
          const resp = await fetch(profilePhoto, { mode: "cors" });
          if (resp.ok) {
            const blob = await resp.blob();
            imageBase64 = await toBase64FromBlob(blob);
          }
        }
      } catch (err) {
        imageBase64 = null;
      }

      // Summarize attachments (hasFile, url) to help debug missing/empty attachments
      const summarize = (map: Record<number, Asset[]>) => {
        const out: Record<string, unknown> = {};
        Object.keys(map).forEach((k) => {
          out[k] = (map[Number(k)] || []).map((a) => ({
            id: a.id,
            name: a.name,
            attachments: (a.attachments || []).map((att) => ({
              name: att && typeof att.name === "string" ? att.name : null,
              hasFile: !!(att && (att as { file?: File }).file),
              url: att && typeof att.url === "string" ? att.url : null,
            })),
          }));
        });
        return out;
      };

      // eslint-disable-next-line no-console
      console.debug(
        "[submitToApi] attachments summary:",
        summarize(assetsByVisitor)
      );

      const fd = buildVisitorFormData({
        primaryVisitor,
        additionalVisitors,
        carryingAssetFlag: carryingAsset,
        imageBase64,
        includeImage: profilePhotoChanged,
      });

      // Debug: inspect FormData entries to verify files and keys before sending
      if (fd instanceof FormData) {
        // eslint-disable-next-line no-console
        console.debug("[submitToApi] FormData entries:");
        for (const entry of fd.entries()) {
          const [k, v] = entry as [string, unknown];
          if (v instanceof File) {
            // eslint-disable-next-line no-console
            console.debug(k, "(File)", v.name, v.type, v.size);
          } else {
            // eslint-disable-next-line no-console
            console.debug(k, String(v));
          }
        }
      }

      // eslint-disable-next-line no-console
      console.log("[submitToApi] submitting to:", url);
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: fd,
      });
      if (!res.ok) {
        showToast("Submission failed. Please try again.");
        setApiError(`Submit failed (${res.status})`);
        setIsSubmitting(false);
        // auto-hide after 6 seconds
        if (apiErrorTimerRef.current)
          window.clearTimeout(apiErrorTimerRef.current);
        apiErrorTimerRef.current = window.setTimeout(
          () => setApiError(null),
          6000
        );
        return;
      }
      await res.json();
      setShowSuccess(true);
      setIsSubmitting(false);
    } catch (err) {
      showToast("Network error. Please check your connection.");
      setApiError("Network error during submit");
      setIsSubmitting(false);
      if (apiErrorTimerRef.current)
        window.clearTimeout(apiErrorTimerRef.current);
      apiErrorTimerRef.current = window.setTimeout(
        () => setApiError(null),
        6000
      );
    }
  };

  // If server told us the form was already submitted, render only the card
  if (alreadySubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm px-2">
          <div className="bg-white border border-gray-100 rounded-lg shadow-md p-5 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-1">
              Form already submitted
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This submission has been received by the host. No further actions
              are available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-4 pb-4 px-2">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg pb-28">
        {/* Header */}
        <div className="bg-[#D5DBDB66] rounded p-3 mb-3">
          <h2 className="text-lg font-semibold">
            {step === 1
              ? "1. Visitor Registration"
              : step === 2
                ? "2. Additional & Logistics Details"
                : step === 3
                  ? "3. Asset Declaration"
                  : step === 4
                    ? "4. Identity Verification"
                    : step === 5
                      ? "5. Non Discloser Agreement (NDA)"
                      : "Preview"}
          </h2>
          <div className="text-sm text-gray-600 mt-1">{step} of 6 steps</div>
          <div className="mt-3">
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full ${i === step
                    ? "bg-[#C72030]"
                    : i < step
                      ? "bg-[#d9d0bf]"
                      : "bg-gray-200"
                    }`}
                />
              ))}
            </div>

            {/* Toast */}
            {toastVisible && toastMessage && (
              <div className="fixed left-1/2 transform -translate-x-1/2 bottom-20 z-50 w-[90%] sm:w-auto max-w-md">
                <div className="mx-auto bg-[#111827] text-white text-sm px-4 py-3 rounded shadow-lg text-center">
                  {toastMessage}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-white rounded p-2 shadow-sm">
            {/* Profile photo upload (required) */}
            <div
              className={`mt-2 border-2 border-dashed rounded p-3 ${profilePhotoError ? "border-[#C72030]" : "border-gray-200"}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-full border border-gray-200 flex items-center justify-center bg-white overflow-hidden cursor-pointer"
                  onClick={() => openCamera()}
                  title="Click to open camera"
                >
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Camera body */}
                      <path
                        d="M3 7a2 2 0 0 1 2-2h2l1-2h6l1 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
                        stroke="#9CA3AF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Centered lens */}
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#9CA3AF"
                        strokeWidth="1.5"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">
                    Profile Photo <span className="text-[#C72030]">*</span>
                  </div>
                  <div className="mt-2">
                    <label className="inline-block">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          if (!file) return;
                          const type = file.type || "";
                          const name = file.name || "";
                          const ext =
                            name.split(".").pop()?.toLowerCase() || "";
                          const isSvg =
                            type === "image/svg+xml" || ext === "svg";
                          if (isSvg) {
                            setProfilePhoto(null);
                            setProfilePhotoFile(null);
                            setProfilePhotoChanged(false);
                            setProfilePhotoError(true);
                            showToast(
                              "SVG files are not allowed for profile photo. Please upload PNG or JPEG."
                            );
                            return;
                          }
                          // allow only PNG/JPEG
                          const allowed = ["image/png", "image/jpeg"];
                          if (
                            !allowed.includes(type) &&
                            !["png", "jpg", "jpeg"].includes(ext)
                          ) {
                            setProfilePhoto(null);
                            setProfilePhotoFile(null);
                            setProfilePhotoChanged(false);
                            setProfilePhotoError(true);
                            showToast("Please upload a PNG or JPEG image.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => {
                            setProfilePhoto(String(reader.result));
                            setProfilePhotoFile(file);
                            setProfilePhotoChanged(true);
                            setProfilePhotoError(false);
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      <span className="bg-[#C72030] text-white px-4 py-2 rounded shadow cursor-pointer inline-block">
                        Upload Photo
                      </span>
                    </label>
                    {/* Use Camera button removed - avatar circle opens camera instead */}

                    {showCameraModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div
                          className="absolute inset-0 bg-black/50"
                          onClick={() => {
                            if (stream)
                              stream.getTracks().forEach((t) => t.stop());
                            setStream(null);
                            setShowCameraModal(false);
                          }}
                        />
                        <div className="bg-white rounded p-4 z-10 w-[90%] max-w-md">
                          <div className="flex flex-col items-stretch gap-3">
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              className="w-full h-56 bg-black rounded"
                            />
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => {
                                  const video = videoRef.current;
                                  if (!video) return;
                                  const canvas =
                                    document.createElement("canvas");
                                  canvas.width = video.videoWidth || 640;
                                  canvas.height = video.videoHeight || 480;
                                  const ctx = canvas.getContext("2d");
                                  if (ctx)
                                    ctx.drawImage(
                                      video,
                                      0,
                                      0,
                                      canvas.width,
                                      canvas.height
                                    );
                                  const dataUrl = canvas.toDataURL(
                                    "image/jpeg",
                                    0.85
                                  );
                                  setProfilePhoto(dataUrl);
                                  const arr = dataUrl.split(",");
                                  const mime =
                                    arr[0].match(/:(.*?);/)?.[1] ||
                                    "image/jpeg";
                                  const bstr = atob(arr[1]);
                                  let n = bstr.length;
                                  const u8arr = new Uint8Array(n);
                                  while (n--) u8arr[n] = bstr.charCodeAt(n);
                                  const file = new File(
                                    [u8arr],
                                    `camera_${Date.now()}.jpg`,
                                    { type: mime }
                                  );
                                  setProfilePhotoFile(file);
                                  setProfilePhotoChanged(true);
                                  if (stream)
                                    stream.getTracks().forEach((t) => t.stop());
                                  setStream(null);
                                  setShowCameraModal(false);
                                }}
                                className="bg-[#C72030] text-white px-4 py-2 rounded"
                              >
                                Capture
                              </button>
                              <button
                                onClick={() => {
                                  if (stream)
                                    stream.getTracks().forEach((t) => t.stop());
                                  setStream(null);
                                  setShowCameraModal(false);
                                }}
                                className="bg-white border border-gray-200 px-4 py-2 rounded"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    This photo will appear on your gate pass
                  </div>
                  {profilePhotoError && (
                    <div className="text-xs text-[#C72030] mt-2">
                      Please upload a profile photo to continue.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm  bg-[#D9D9D940] p-2">
              {/* Pre-filled banner */}
              <div className="mb-3 px-1">
                <div className="flex items-center gap-2 rounded border border-gray-200 bg-[#C4AE9D59] px-3 py-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#C72030]">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-sm text-gray-800">
                    Basic details pre-filled by host
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M12.6635 13.997V12.664C12.6635 11.957 12.3826 11.2789 11.8827 10.7789C11.3827 10.2789 10.7046 9.99805 9.99751 9.99805H5.99852C5.29145 9.99805 4.61334 10.2789 4.11337 10.7789C3.6134 11.2789 3.33252 11.957 3.33252 12.664V13.997"
                      stroke="#344153"
                      stroke-width="1.333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7.99803 7.33199C9.47042 7.33199 10.664 6.13839 10.664 4.666C10.664 3.19361 9.47042 2 7.99803 2C6.52564 2 5.33203 3.19361 5.33203 4.666C5.33203 6.13839 6.52564 7.33199 7.99803 7.33199Z"
                      stroke="#344153"
                      stroke-width="1.333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Guest Type
                </div>
                <div className="mt-2">
                  <select
                    value={guestType}
                    onChange={(e) =>
                      setGuestType(e.target.value as "Once" | "Frequent")
                    }
                    disabled
                    className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm cursor-not-allowed"
                  >
                    <option value="Once">Once</option>
                    <option value="Frequent">Frequent</option>
                  </select>
                </div>
              </div>

              {guestType === "Frequent" && (
                <div className="mt-3 bg-white border border-gray-100 rounded p-3 pointer-events-none opacity-60">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-600">Valid From*</div>
                      <input
                        type="date"
                        value={passStartDate || ""}
                        className="mt-1 w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm"
                        disabled
                      />
                    </div>

                    <div>
                      <div className="text-xs text-gray-600">Valid To*</div>
                      <input
                        type="date"
                        value={passEndDate || ""}
                        className="mt-1 w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-gray-600">Day Permitted:</div>
                    <div className="mt-2 flex gap-2">
                      {["S", "M", "T", "W", "Th", "F", "S"].map((label, i) => {
                        const key = String(i);
                        const selected = passDays.includes(key);

                        return (
                          <button
                            key={i}
                            type="button"
                            disabled
                            className={`w-8 h-8 rounded border flex items-center justify-center text-sm ${selected
                              ? "bg-[#d8d3c6] border-[#d8d3c6]"
                              : "bg-gray-100 border-gray-200"
                              }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs text-gray-600">
                  Contact Number <span className="text-[#C72030]">*</span>
                </div>
                <input
                  value={contact}
                  readOnly
                  disabled
                  className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm cursor-not-allowed"
                  placeholder="Enter number"
                />
              </div>

              <div>
                <div className="text-xs text-gray-600">
                  Name <span className="text-[#C72030]">*</span>
                </div>
                <input
                  value={name}
                  readOnly
                  disabled
                  className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm cursor-not-allowed"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <div className="text-xs text-gray-600">Mail</div>
                <input
                  value={email}
                  readOnly
                  disabled
                  className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm cursor-not-allowed"
                  placeholder="Enter mail id"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-600">
                    Expected Date <span className="text-[#C72030]">*</span>
                  </div>
                  <input
                    value={expectedDate}
                    readOnly
                    disabled
                    className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm cursor-not-allowed"
                    placeholder="dd/mm/yyyy"
                  />
                </div>
                <div>
                  <div className="text-xs text-gray-600">
                    Expected Time <span className="text-[#C72030]">*</span>
                  </div>
                  <input
                    value={expectedTime}
                    readOnly
                    disabled
                    className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm cursor-not-allowed"
                    placeholder="07:00 AM"
                  />
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-600">Purpose</div>
                <input
                  value={purpose}
                  readOnly
                  disabled
                  className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm cursor-not-allowed"
                  placeholder="Meeting"
                />
              </div>

              <div>
                <div className="text-xs text-gray-600">Company Name</div>
                <input
                  value={company}
                  readOnly
                  disabled
                  className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm cursor-not-allowed"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <div className="text-xs text-gray-600">Location</div>
                <input
                  value={location}
                  readOnly
                  disabled
                  className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm cursor-not-allowed"
                  placeholder="Enter location"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="w-full">
                  <div className="text-xs text-gray-600">Person to meet</div>
                  <input
                    value={personToMeetName}
                    readOnly
                    disabled
                    placeholder="Enter person to meet"
                    className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Non Discloser Agreement (NDA) */}
        {step === 5 && (
          <div className="bg-white rounded shadow-sm p-2">
            <div className="p-3">
              <div className="bg-white border border-gray-100 rounded p-4 text-sm leading-6 text-gray-800">
                {apiConsentHtml ? (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: apiConsentHtml }}
                  />
                ) : (
                  <div className="text-sm text-gray-700">
                    By entering the premises, you (“Visitor”) acknowledge and
                    agree to the terms provided by the host.
                  </div>
                )}
              </div>

              <label className="mt-4 flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <span
                  className={`w-5 h-5 inline-flex items-center justify-center rounded border ${ndaAgree ? "bg-[#C72030] border-[#C72030]" : "border-gray-300 bg-white"}`}
                >
                  {ndaAgree && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <input
                  type="checkbox"
                  checked={ndaAgree}
                  onChange={(e) => setNdaAgree(e.target.checked)}
                  className="hidden"
                />
                I have read and agree to terms & conditions.
              </label>
            </div>
          </div>
        )}

        {/* Step 6: Preview */}
        {step === 6 && (
          <div className="bg-white rounded shadow-sm p-2">
            <div className="p-3 space-y-4">
              {/* Profile Photo placeholder */}
              <div className="bg-white border border-gray-100 rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Profile Photo</div>
                  <button
                    type="button"
                    aria-label="Edit profile photo"
                    onClick={() => {
                      setReturnToPreviewOnNext(true);
                      setStep(1);
                    }}
                    className="text-gray-600"
                  >
                    <svg
                      width="36"
                      height="32"
                      viewBox="0 0 36 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_23208_24694)">
                        <path
                          d="M24.1036 12.5395C24.456 12.1872 24.654 11.7093 24.6541 11.211C24.6541 10.7128 24.4563 10.2349 24.104 9.88248C23.7517 9.5301 23.2738 9.33209 22.7755 9.33203C22.2773 9.33197 21.7994 9.52985 21.447 9.88215L12.5519 18.7792C12.3971 18.9335 12.2827 19.1235 12.2186 19.3324L11.3382 22.233C11.3209 22.2907 11.3196 22.3519 11.3344 22.4102C11.3492 22.4686 11.3794 22.5218 11.422 22.5643C11.4646 22.6068 11.5179 22.637 11.5762 22.6517C11.6346 22.6663 11.6958 22.6649 11.7534 22.6476L14.6547 21.7678C14.8634 21.7043 15.0534 21.5906 15.2079 21.4366L24.1036 12.5395Z"
                          stroke="#C72030"
                          strokeWidth="1.333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_23208_24694">
                          <rect
                            width="15.996"
                            height="15.996"
                            fill="white"
                            transform="translate(9.99121 7.99805)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-400">
                      This photo will appear on your gate pass
                    </div>
                  </div>
                </div>
              </div>

              {/* Visitor Details */}
              <div className="bg-white border border-gray-100 rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Visitor Details</div>
                  <button
                    type="button"
                    aria-label="Edit visitor details"
                    onClick={() => {
                      setReturnToPreviewOnNext(true);
                      setStep(1);
                    }}
                    className="text-gray-600"
                  >
                    <svg
                      width="36"
                      height="32"
                      viewBox="0 0 36 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_23208_24694)">
                        <path
                          d="M24.1036 12.5395C24.456 12.1872 24.654 11.7093 24.6541 11.211C24.6541 10.7128 24.4563 10.2349 24.104 9.88248C23.7517 9.5301 23.2738 9.33209 22.7755 9.33203C22.2773 9.33197 21.7994 9.52985 21.447 9.88215L12.5519 18.7792C12.3971 18.9335 12.2827 19.1235 12.2186 19.3324L11.3382 22.233C11.3209 22.2907 11.3196 22.3519 11.3344 22.4102C11.3492 22.4686 11.3794 22.5218 11.422 22.5643C11.4646 22.6068 11.5179 22.637 11.5762 22.6517C11.6346 22.6663 11.6958 22.6649 11.7534 22.6476L14.6547 21.7678C14.8634 21.7043 15.0534 21.5906 15.2079 21.4366L24.1036 12.5395Z"
                          stroke="#C72030"
                          strokeWidth="1.333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_23208_24694">
                          <rect
                            width="15.996"
                            height="15.996"
                            fill="white"
                            transform="translate(9.99121 7.99805)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
                <div className="mt-2 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name:</span>
                    <span className="text-gray-900 font-medium">
                      {name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mobile:</span>
                    <span className="text-gray-900 font-medium">
                      {contact || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="text-gray-900 font-medium">
                      {email || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expected Date & Time:</span>
                    <span className="text-gray-900 font-medium">
                      {expectedDate && expectedTime
                        ? `${expectedDate}, ${expectedTime}`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Purpose of Visit:</span>
                    <span className="text-gray-900 font-medium">
                      {purpose || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Company:</span>
                    <span className="text-gray-900 font-medium">
                      {company || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">To Location:</span>
                    <span className="text-gray-900 font-medium">
                      {location || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Guest Type:</span>
                    <span className="text-gray-900 font-medium">
                      {guestType || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Additional visitors summary */}
                <div className="mt-3 border-t border-gray-100 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-600">
                      Additional Visitors:
                    </div>
                    <div className="w-6 h-6 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">
                      {visitors.length}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-700">
                    {visitors.length === 0 ? (
                      <div>None</div>
                    ) : (
                      <ul className="space-y-1">
                        {visitors.map((v) => (
                          <li key={v.id} className="flex justify-between">
                            <span className="text-gray-700">
                              {v.name || `Visitor ${v.id}`}
                            </span>
                            <span className="text-gray-500">
                              {v.contact || "—"}
                              {v.vehicleNumber ? ` • ${v.vehicleNumber}` : ""}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Logistics Details */}
              <div className="bg-white border border-gray-100 rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">Logistics Details</div>
                    {visitors && visitors.length > 0 && (
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C72030] text-white text-xs font-medium"
                        aria-label={`Additional visitors (logistics): ${visitors.length}`}
                      >
                        {visitors.length}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label="Edit logistics details"
                    onClick={() => {
                      setReturnToPreviewOnNext(true);
                      setStep(2);
                    }}
                    className="text-gray-600"
                  >
                    <svg
                      width="36"
                      height="32"
                      viewBox="0 0 36 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_23208_24694)">
                        <path
                          d="M24.1036 12.5395C24.456 12.1872 24.654 11.7093 24.6541 11.211C24.6541 10.7128 24.4563 10.2349 24.104 9.88248C23.7517 9.5301 23.2738 9.33209 22.7755 9.33203C22.2773 9.33197 21.7994 9.52985 21.447 9.88215L12.5519 18.7792C12.3971 18.9335 12.2827 19.1235 12.2186 19.3324L11.3382 22.233C11.3209 22.2907 11.3196 22.3519 11.3344 22.4102C11.3492 22.4686 11.3794 22.5218 11.422 22.5643C11.4646 22.6068 11.5179 22.637 11.5762 22.6517C11.6346 22.6663 11.6958 22.6649 11.7534 22.6476L14.6547 21.7678C14.8634 21.7043 15.0534 21.5906 15.2079 21.4366L24.1036 12.5395Z"
                          stroke="#C72030"
                          strokeWidth="1.333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_23208_24694">
                          <rect
                            width="15.996"
                            height="15.996"
                            fill="white"
                            transform="translate(9.99121 7.99805)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
                <div className="mt-2 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">To Location:</span>
                    <span className="text-gray-900 font-medium">
                      {toLocation || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vehicle:</span>
                    <span className="text-gray-900 font-medium">
                      {primaryVehicle
                        ? primaryVehicle === "car"
                          ? "Car"
                          : "Bike"
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vehicle No.:</span>
                    <span className="text-gray-900 font-medium">
                      {primaryVehicleNumber || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assets Details (Primary only simple summary) */}
              <div className="bg-white border border-gray-100 rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">Assets Details</div>
                    {visitors && visitors.length > 0 && (
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C72030] text-white text-xs font-medium"
                        aria-label={`Additional visitors carrying assets: ${visitors.length}`}
                      >
                        {visitors.length}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label="Edit assets details"
                    onClick={() => {
                      setReturnToPreviewOnNext(true);
                      setStep(3);
                    }}
                    className="text-gray-600"
                  >
                    <svg
                      width="36"
                      height="32"
                      viewBox="0 0 36 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_23208_24694)">
                        <path
                          d="M24.1036 12.5395C24.456 12.1872 24.654 11.7093 24.6541 11.211C24.6541 10.7128 24.4563 10.2349 24.104 9.88248C23.7517 9.5301 23.2738 9.33209 22.7755 9.33203C22.2773 9.33197 21.7994 9.52985 21.447 9.88215L12.5519 18.7792C12.3971 18.9335 12.2827 19.1235 12.2186 19.3324L11.3382 22.233C11.3209 22.2907 11.3196 22.3519 11.3344 22.4102C11.3492 22.4686 11.3794 22.5218 11.422 22.5643C11.4646 22.6068 11.5179 22.637 11.5762 22.6517C11.6346 22.6663 11.6958 22.6649 11.7534 22.6476L14.6547 21.7678C14.8634 21.7043 15.0534 21.5906 15.2079 21.4366L24.1036 12.5395Z"
                          stroke="#C72030"
                          strokeWidth="1.333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_23208_24694">
                          <rect
                            width="15.996"
                            height="15.996"
                            fill="white"
                            transform="translate(9.99121 7.99805)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
                <div className="mt-2 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Primary Visitor:</span>
                    <span className="text-gray-900 font-medium">
                      {name || "Primary Visitor"}
                    </span>
                  </div>
                  {(() => {
                    // Show only primary visitor's first asset summary in Preview
                    const list = assetsByVisitor[0] || [];
                    if (!carryingAsset || list.length === 0)
                      return (
                        <div className="text-gray-500">No assets declared</div>
                      );
                    const first = list[0];
                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Asset Category:</span>
                          <span className="text-gray-900 font-medium">
                            {first.category || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Asset Name:</span>
                          <span className="text-gray-900 font-medium">
                            {first.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Serial No:</span>
                          <span className="text-gray-900 font-medium">
                            {first.serial || "N/A"}
                          </span>
                        </div>
                        {first.notes && (

                          <div className="flex justify-between">
                            <span className="text-gray-500">Notes:</span>
                            <span className="text-gray-900 font-medium">
                              {first.notes || "N/A"}
                            </span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Identity Verification summary */}
              <div className="bg-white border border-gray-100 rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">
                    Identity Verification
                    {visitors && visitors.length > 0 ? (
                      <span
                        className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C72030] text-white text-xs font-medium"
                        aria-label={`Additional visitors: ${visitors.length}`}
                      >
                        {visitors.length}
                      </span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    aria-label="Edit identity verification"
                    onClick={() => {
                      setReturnToPreviewOnNext(true);
                      setStep(4);
                    }}
                    className="text-gray-600"
                  >
                    <svg
                      width="36"
                      height="32"
                      viewBox="0 0 36 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_23208_24694)">
                        <path
                          d="M24.1036 12.5395C24.456 12.1872 24.654 11.7093 24.6541 11.211C24.6541 10.7128 24.4563 10.2349 24.104 9.88248C23.7517 9.5301 23.2738 9.33209 22.7755 9.33203C22.2773 9.33197 21.7994 9.52985 21.447 9.88215L12.5519 18.7792C12.3971 18.9335 12.2827 19.1235 12.2186 19.3324L11.3382 22.233C11.3209 22.2907 11.3196 22.3519 11.3344 22.4102C11.3492 22.4686 11.3794 22.5218 11.422 22.5643C11.4646 22.6068 11.5179 22.637 11.5762 22.6517C11.6346 22.6663 11.6958 22.6649 11.7534 22.6476L14.6547 21.7678C14.8634 21.7043 15.0534 21.5906 15.2079 21.4366L24.1036 12.5395Z"
                          stroke="#C72030"
                          strokeWidth="1.333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_23208_24694">
                          <rect
                            width="15.996"
                            height="15.996"
                            fill="white"
                            transform="translate(9.99121 7.99805)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
                <div className="mt-2 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Government ID:</span>
                    <span className="text-gray-900 font-medium">
                      {identityByVisitor[0]?.govId || "N/A"}
                    </span>
                  </div>
                  {(() => {
                    const docs = identityByVisitor[0]?.documents;
                    if (!Array.isArray(docs) || docs.length === 0) return null;
                    return (
                      <>
                        <div className="text-gray-500">Attachment:</div>
                        <div className="mt-1 grid grid-cols-2 gap-2">
                          {docs.map((doc, i) => (
                            <a
                              key={i}
                              href={doc.url}
                              target="_blank"
                              rel="noreferrer"
                              className="h-20 block rounded overflow-hidden border"
                            >
                              <img
                                src={doc.url}
                                alt={doc.name || "doc"}
                                className="w-full h-full object-cover"
                              />
                            </a>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  onClick={submitToApi}
                  className={`w-full py-3 rounded font-semibold text-white ${isSubmitting ? "bg-gray-400 cursor-wait" : "bg-[#C72030]"}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
              {/* Back button shown only on Preview, placed below Submit */}
              <div className="mt-2">
                <button
                  onClick={() => {
                    // Clear validation errors and return to previous step (5)
                    setVisitorErrors({});
                    setPrimaryVehicleError(false);
                    setAssetCategoryErrors({});
                    setStep(5);
                  }}
                  className="w-full py-3 rounded bg-white border border-gray-200 text-gray-700"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-50 w-80 max-w-xs bg-white rounded-lg shadow-lg p-5">
              <button
                aria-label="Close"
                onClick={() => {
                  // reload the page so the GET prefill runs again
                  if (typeof window !== "undefined") window.location.reload();
                }}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#4ade80] flex items-center justify-center mb-3 relative">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="text-lg font-semibold">
                  Registration Successful!
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Visitor registration has been submitted & sent to host
                  successfully.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {(step as number) === 2 && (
          <div className="bg-white rounded shadow-sm p-2">
            <div className="flex items-center justify-between border-b border-gray-100 px-3 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.32791 9.86957C7.99804 9.42344 8.50681 8.77349 8.77898 8.01585C9.05115 7.25821 9.07227 6.43309 8.83923 5.66251C8.60619 4.89193 8.13135 4.2168 7.48493 3.73696C6.83851 3.25712 6.05483 2.99805 5.24979 2.99805C4.44474 2.99805 3.66106 3.25712 3.01464 3.73696C2.36823 4.2168 1.89339 4.89193 1.66034 5.66251C1.4273 6.43309 1.44843 7.25821 1.7206 8.01585C1.99277 8.77349 2.50154 9.42344 3.17166 9.86957C1.95947 10.3163 0.924228 11.1431 0.220412 12.2264C0.183422 12.2814 0.157728 12.3432 0.144825 12.4082C0.131922 12.4732 0.132066 12.5401 0.14525 12.605C0.158434 12.67 0.184394 12.7316 0.221621 12.7865C0.258848 12.8413 0.3066 12.8882 0.362101 12.9244C0.417602 12.9606 0.479745 12.9854 0.544917 12.9973C0.610089 13.0093 0.676991 13.0082 0.741734 12.9941C0.806477 12.98 0.867769 12.9531 0.922048 12.9151C0.976327 12.8771 1.02251 12.8287 1.05791 12.7727C1.51191 12.0744 2.13313 11.5006 2.86519 11.1034C3.59724 10.7062 4.41691 10.4982 5.24979 10.4982C6.08266 10.4982 6.90234 10.7062 7.63439 11.1034C8.36644 11.5006 8.98767 12.0744 9.44166 12.7727C9.515 12.8817 9.62828 12.9574 9.75702 12.9836C9.88577 13.0097 10.0196 12.9841 10.1297 12.9124C10.2397 12.8406 10.3171 12.7284 10.345 12.6001C10.373 12.4717 10.3493 12.3375 10.2792 12.2264C9.57535 11.1431 8.5401 10.3163 7.32791 9.86957ZM2.49979 6.74957C2.49979 6.20567 2.66107 5.67399 2.96325 5.22175C3.26542 4.76952 3.69491 4.41704 4.19741 4.2089C4.6999 4.00076 5.25284 3.9463 5.78629 4.05241C6.31973 4.15852 6.80974 4.42043 7.19433 4.80502C7.57893 5.18962 7.84084 5.67962 7.94695 6.21307C8.05306 6.74652 7.9986 7.29945 7.79046 7.80195C7.58231 8.30444 7.22984 8.73394 6.77761 9.03611C6.32537 9.33828 5.79369 9.49957 5.24979 9.49957C4.5207 9.49874 3.8217 9.20874 3.30616 8.6932C2.79061 8.17765 2.50061 7.47866 2.49979 6.74957ZM15.6335 12.9183C15.5225 12.9907 15.3872 13.0161 15.2574 12.9888C15.1277 12.9615 15.0141 12.8837 14.9417 12.7727C14.4882 12.074 13.8671 11.5 13.1349 11.1029C12.4027 10.7059 11.5827 10.4985 10.7498 10.4996C10.6172 10.4996 10.49 10.4469 10.3962 10.3531C10.3025 10.2594 10.2498 10.1322 10.2498 9.99957C10.2498 9.86696 10.3025 9.73978 10.3962 9.64601C10.49 9.55225 10.6172 9.49957 10.7498 9.49957C11.1548 9.49919 11.5547 9.40936 11.9209 9.23651C12.2872 9.06367 12.6107 8.81206 12.8684 8.49968C13.1262 8.18729 13.3117 7.82184 13.4118 7.42943C13.512 7.03702 13.5242 6.62734 13.4476 6.22966C13.371 5.83198 13.2076 5.45613 12.9689 5.12894C12.7303 4.80176 12.4223 4.53132 12.067 4.33696C11.7117 4.1426 11.3178 4.02912 10.9136 4.00461C10.5094 3.9801 10.1047 4.04518 9.72854 4.19519C9.6672 4.22171 9.60118 4.23566 9.53436 4.23622C9.46754 4.23679 9.40129 4.22395 9.33952 4.19848C9.27775 4.17301 9.22171 4.13541 9.17471 4.08791C9.12771 4.04041 9.09071 3.98398 9.0659 3.92194C9.04108 3.8599 9.02895 3.79351 9.03023 3.72671C9.0315 3.6599 9.04615 3.59402 9.07332 3.53298C9.10048 3.47193 9.13961 3.41694 9.18838 3.37127C9.23715 3.3256 9.29459 3.29017 9.35729 3.26707C10.2182 2.92373 11.1758 2.91137 12.0452 3.23239C12.9147 3.5534 13.6345 4.18504 14.0658 5.00545C14.497 5.82587 14.6092 6.77692 14.3806 7.67514C14.152 8.57336 13.5989 9.35511 12.8279 9.86957C14.0401 10.3163 15.0753 11.1431 15.7792 12.2264C15.8516 12.3375 15.8769 12.4728 15.8496 12.6025C15.8223 12.7323 15.7446 12.8459 15.6335 12.9183Z"
                    fill="black"
                  />
                </svg>
                Additional Visitors
              </div>
              <button
                onClick={addVisitor}
                className="text-sm px-3 py-2 border border-[#C72030] text-black rounded"
              >
                Add Visitor
              </button>
            </div>

            <div className="p-3">
              {visitors.length === 0 && (
                <div className="text-sm text-gray-500">
                  No additional visitors added.
                </div>
              )}

              {visitors.map((visitor) => (
                <div
                  key={visitor.id}
                  className="border border-gray-100 rounded mb-3"
                >
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#C72030] text-white flex items-center justify-center text-xs">
                        {visitor.id}
                      </div>
                      <div className="text-sm font-medium">
                        {visitor.name || `Visitor ${visitor.id}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeVisitor(visitor.id)}
                        className="text-gray-400 hover:text-gray-700"
                      >
                        <svg
                          width="10"
                          height="11"
                          viewBox="0 0 10 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.3125 9.625C1.3125 10.3495 1.90006 10.9375 2.625 10.9375H7C7.7245 10.9375 8.3125 10.3495 8.3125 9.625L9.1875 2.625H0.4375L1.3125 9.625ZM6.125 3.9375H7V9.625H6.125V3.9375ZM4.375 3.9375H5.25V9.625H4.375V3.9375ZM2.625 3.9375H3.5V9.625H2.625V3.9375ZM8.96875 0.875H6.125C6.125 0.875 5.929 0 5.6875 0H3.9375C3.69556 0 3.5 0.875 3.5 0.875H0.65625C0.293563 0.875 0 1.16856 0 1.53125C0 1.89394 0 2.1875 0 2.1875H9.625C9.625 2.1875 9.625 1.89394 9.625 1.53125C9.625 1.16856 9.331 0.875 8.96875 0.875Z"
                            fill="black"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 space-y-3">
                    <div>
                      <div className="text-xs text-gray-600">
                        Contact Number <span className="text-[#C72030]">*</span>
                      </div>
                      <input
                        disabled={!newlyAddedVisitorIds.has(visitor.id)}
                        value={visitor.contact}
                        onChange={(e) =>
                          updateVisitor(visitor.id, { contact: e.target.value })
                        }
                        className={`mt-1 w-full bg-white border rounded px-3 py-2 text-sm ${!newlyAddedVisitorIds.has(visitor.id) ? "bg-gray-100 cursor-not-allowed" : ""} ${visitorErrors[visitor.id]?.contact ? "border-[#C72030]" : "border-gray-200"}`}
                        placeholder="Enter number"
                      />
                      {visitorErrors[visitor.id]?.contact && (
                        <div className="text-xs text-[#C72030] mt-1">
                          Contact number is required
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-xs text-gray-600">
                        Name <span className="text-[#C72030]">*</span>
                      </div>
                      <input
                        disabled={!newlyAddedVisitorIds.has(visitor.id)}
                        value={visitor.name}
                        onChange={(e) =>
                          updateVisitor(visitor.id, { name: e.target.value })
                        }
                        className={`mt-1 w-full bg-white border rounded px-3 py-2 text-sm ${!newlyAddedVisitorIds.has(visitor.id) ? "bg-gray-100 cursor-not-allowed" : ""} ${visitorErrors[visitor.id]?.name ? "border-[#C72030]" : "border-gray-200"}`}
                        placeholder="Enter full name"
                      />
                      {visitorErrors[visitor.id]?.name && (
                        <div className="text-xs text-[#C72030] mt-1">
                          Name is required
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-xs text-gray-600">Mail</div>
                      <input
                        disabled={!newlyAddedVisitorIds.has(visitor.id)}
                        value={visitor.email}
                        onChange={(e) =>
                          updateVisitor(visitor.id, { email: e.target.value })
                        }
                        className={`mt-1 w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm ${!newlyAddedVisitorIds.has(visitor.id) ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        placeholder="Enter mail id"
                      />
                    </div>

                    <div>
                      <div className="text-xs text-gray-600 mb-2">
                        Vehicle Details
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          disabled={!newlyAddedVisitorIds.has(visitor.id)}
                          type="button"
                          onClick={() =>
                            updateVisitor(visitor.id, { vehicle: "car" })
                          }
                          className={`py-3 rounded border ${!newlyAddedVisitorIds.has(visitor.id) ? "opacity-50 cursor-not-allowed" : ""} ${visitor.vehicle === "car" ? "bg-[#d8d3c6] border-[#d8d3c6]" : "bg-white border border-gray-200"}`}
                        >
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M19 17H21C21.6 17 22 16.6 22 16V13C22 12.1 21.3 11.3 20.5 11.1C18.7 10.6 16 10 16 10C16 10 14.7 8.6 13.8 7.7C13.3 7.3 12.7 7 12 7H5C4.4 7 3.9 7.4 3.6 7.9L2.2 10.8C2.06758 11.1862 2 11.5917 2 12V16C2 16.6 2.4 17 3 17H5"
                                stroke="#1B1B1B"
                                strokeWidth="1.99991"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M7 19C8.10457 19 9 18.1046 9 17C9 15.8954 8.10457 15 7 15C5.89543 15 5 15.8954 5 17C5 18.1046 5.89543 19 7 19Z"
                                stroke="#1B1B1B"
                                strokeWidth="1.99991"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M8.99951 17H14.9995"
                                stroke="#1B1B1B"
                                strokeWidth="1.99991"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M16.9995 19C18.1041 19 18.9995 18.1046 18.9995 17C18.9995 15.8954 18.1041 15 16.9995 15C15.8949 15 14.9995 15.8954 14.9995 17C14.9995 18.1046 15.8949 19 16.9995 19Z"
                                stroke="#1B1B1B"
                                strokeWidth="1.99991"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Car
                          </div>
                        </button>
                        <button
                          disabled={!newlyAddedVisitorIds.has(visitor.id)}
                          type="button"
                          onClick={() =>
                            updateVisitor(visitor.id, { vehicle: "bike" })
                          }
                          className={`py-3 rounded border ${!newlyAddedVisitorIds.has(visitor.id) ? "opacity-50 cursor-not-allowed" : ""} ${visitor.vehicle === "bike" ? "bg-[#d8d3c6] border-[#d8d3c6]" : "bg-white border border-gray-200"}`}
                        >
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M18.4995 21C20.4325 21 21.9995 19.433 21.9995 17.5C21.9995 15.567 20.4325 14 18.4995 14C16.5665 14 14.9995 15.567 14.9995 17.5C14.9995 19.433 16.5665 21 18.4995 21Z"
                                stroke="#4A5565"
                                strokeWidth="1.99991"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M5.5 21C7.433 21 9 19.433 9 17.5C9 15.567 7.433 14 5.5 14C3.567 14 2 15.567 2 17.5C2 19.433 3.567 21 5.5 21Z"
                                stroke="#4A5565"
                                strokeWidth="1.99991"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M14.9995 6C15.5518 6 15.9995 5.55228 15.9995 5C15.9995 4.44772 15.5518 4 14.9995 4C14.4472 4 13.9995 4.44772 13.9995 5C13.9995 5.55228 14.4472 6 14.9995 6Z"
                                stroke="#4A5565"
                                strokeWidth="1.99991"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M11.9995 17.5V14L8.99951 11L12.9995 8L14.9995 11H16.9995"
                                stroke="#4A5565"
                                strokeWidth="1.99991"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Bike
                          </div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-600">
                        Vehicle Number <span className="text-[#C72030]">*</span>
                      </div>
                      <input
                        disabled={!newlyAddedVisitorIds.has(visitor.id)}
                        value={visitor.vehicleNumber}
                        onChange={(e) =>
                          updateVisitor(visitor.id, {
                            vehicleNumber: e.target.value,
                          })
                        }
                        className={`mt-1 w-full bg-white border rounded px-3 py-2 text-sm ${!newlyAddedVisitorIds.has(visitor.id) ? "bg-gray-100 cursor-not-allowed" : ""} ${visitorErrors[visitor.id]?.vehicleNumber ? "border-[#C72030]" : "border-gray-200"}`}
                        placeholder="Enter Vehicle Registration No."
                      />
                      {visitorErrors[visitor.id]?.vehicleNumber && (
                        <div className="text-xs text-[#C72030] mt-1">
                          Vehicle number is required
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Primary visitor block */}
            <div className="mt-2 border-t border-gray-100 p-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#C72030] text-white flex items-center justify-center text-xs">
                  V
                </div>
                <div className="text-sm font-medium">
                  {name || "Primary Visitor"}{" "}
                  <span className="text-gray-400 text-xs">
                    (Primary Visitor)
                  </span>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-600">To Location</div>
                <input
                  value={toLocation || location}
                  onChange={(e) => setToLocation(e.target.value)}
                  placeholder="Enter location"
                  className="mt-1 w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="mt-3">
                <div className="text-xs text-gray-600 mb-2">
                  Vehicle Details{" "}
                  <span className="text-xs text-gray-400">
                    (Primary Visitor)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPrimaryVehicle("car")}
                    className={`py-3 rounded border ${primaryVehicle === "car" ? "bg-[#d8d3c6] border-[#d8d3c6]" : "bg-white border border-gray-200"}`}
                  >
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19 17H21C21.6 17 22 16.6 22 16V13C22 12.1 21.3 11.3 20.5 11.1C18.7 10.6 16 10 16 10C16 10 14.7 8.6 13.8 7.7C13.3 7.3 12.7 7 12 7H5C4.4 7 3.9 7.4 3.6 7.9L2.2 10.8C2.06758 11.1862 2 11.5917 2 12V16C2 16.6 2.4 17 3 17H5"
                          stroke="#1B1B1B"
                          strokeWidth="1.99991"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 19C8.10457 19 9 18.1046 9 17C9 15.8954 8.10457 15 7 15C5.89543 15 5 15.8954 5 17C5 18.1046 5.89543 19 7 19Z"
                          stroke="#1B1B1B"
                          strokeWidth="1.99991"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8.99951 17H14.9995"
                          stroke="#1B1B1B"
                          strokeWidth="1.99991"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16.9995 19C18.1041 19 18.9995 18.1046 18.9995 17C18.9995 15.8954 18.1041 15 16.9995 15C15.8949 15 14.9995 15.8954 14.9995 17C14.9995 18.1046 15.8949 19 16.9995 19Z"
                          stroke="#1B1B1B"
                          strokeWidth="1.99991"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Car
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrimaryVehicle("bike")}
                    className={`py-3 rounded border ${primaryVehicle === "bike" ? "bg-[#d8d3c6] border-[#d8d3c6]" : "bg-white border border-gray-200"}`}
                  >
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.4995 21C20.4325 21 21.9995 19.433 21.9995 17.5C21.9995 15.567 20.4325 14 18.4995 14C16.5665 14 14.9995 15.567 14.9995 17.5C14.9995 19.433 16.5665 21 18.4995 21Z"
                          stroke="#4A5565"
                          strokeWidth="1.99991"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5.5 21C7.433 21 9 19.433 9 17.5C9 15.567 7.433 14 5.5 14C3.567 14 2 15.567 2 17.5C2 19.433 3.567 21 5.5 21Z"
                          stroke="#4A5565"
                          strokeWidth="1.99991"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14.9995 6C15.5518 6 15.9995 5.55228 15.9995 5C15.9995 4.44772 15.5518 4 14.9995 4C14.4472 4 13.9995 4.44772 13.9995 5C13.9995 5.55228 14.4472 6 14.9995 6Z"
                          stroke="#4A5565"
                          strokeWidth="1.99991"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11.9995 17.5V14L8.99951 11L12.9995 8L14.9995 11H16.9995"
                          stroke="#4A5565"
                          strokeWidth="1.99991"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Bike
                    </div>
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs text-gray-600">
                  Vehicle Number <span className="text-[#C72030]">*</span>
                </div>
                <input
                  value={primaryVehicleNumber}
                  onChange={(e) => setPrimaryVehicleNumber(e.target.value)}
                  placeholder="Enter Vehicle Registration No."
                  className={`mt-1 w-full bg-white border rounded px-3 py-2 text-sm ${primaryVehicleError ? "border-[#C72030]" : "border-gray-200"}`}
                />
                {primaryVehicleError && (
                  <div className="text-xs text-[#C72030] mt-1">
                    Primary vehicle number is required
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Asset Declaration */}
        {step === 3 && (
          <div className="bg-white rounded shadow-sm p-2">
            <div className="flex items-center justify-between border-b border-gray-100 px-3 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4 0C1.79086 0 0 1.79086 0 4C0 6.20915 1.79086 8 4 8C6.20915 8 8 6.20915 8 4C8 1.79086 6.20915 0 4 0ZM1.6 4C1.6 2.67451 2.67451 1.6 4 1.6C5.32549 1.6 6.4 2.67451 6.4 4C6.4 5.32549 5.32549 6.4 4 6.4C2.67451 6.4 1.6 5.32549 1.6 4ZM13.6 0C11.3909 0 9.6 1.79086 9.6 4C9.6 6.20915 11.3909 8 13.6 8C15.8091 8 17.6 6.20915 17.6 4C17.6 1.79086 15.8091 0 13.6 0ZM11.2 4C11.2 2.67451 12.2745 1.6 13.6 1.6C14.9254 1.6 16 2.67451 16 4C16 5.32549 14.9254 6.4 13.6 6.4C12.2745 6.4 11.2 5.32549 11.2 4ZM0 13.6C0 11.3909 1.79086 9.6 4 9.6C6.20915 9.6 8 11.3909 8 13.6C8 15.8091 6.20915 17.6 4 17.6C1.79086 17.6 0 15.8091 0 13.6ZM4 11.2C2.67451 11.2 1.6 12.2745 1.6 13.6C1.6 14.9254 2.67451 16 4 16C5.32549 16 6.4 14.9254 6.4 13.6C6.4 12.2745 5.32549 11.2 4 11.2ZM13.6 9.6C11.3909 9.6 9.6 11.3909 9.6 13.6C9.6 15.8091 11.3909 17.6 13.6 17.6C15.8091 17.6 17.6 15.8091 17.6 13.6C17.6 11.3909 15.8091 9.6 13.6 9.6ZM11.2 13.6C11.2 12.2745 12.2745 11.2 13.6 11.2C14.9254 11.2 16 12.2745 16 13.6C16 14.9254 14.9254 16 13.6 16C12.2745 16 11.2 14.9254 11.2 13.6Z"
                    fill="#344153"
                  />
                </svg>
                Carrying Asset
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={carryingAsset}
                  onChange={(e) => setCarryingAsset(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-red-600 transition"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
              </label>
            </div>

            <div className="p-3">
              {/* Accordion per visitor (including primary) */}
              {(
                [{ id: 0, name }, ...visitors] as Array<{
                  id: number;
                  name?: string;
                }>
              ).map((v) => (
                <div
                  id={`asset-visitor-${v.id}`}
                  key={v.id}
                  className="border border-gray-100 rounded mb-3"
                >
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#C72030] text-white flex items-center justify-center text-xs">
                        {v.id === 0 ? "V" : v.id}
                      </div>
                      <div className="text-sm font-medium">
                        {v.name ||
                          (v.id === 0 ? "Primary Visitor" : `Visitor ${v.id}`)}
                        {v.id === 0 && (
                          <span className="text-gray-400 text-xs">
                            {" "}
                            (Primary Visitor)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          v.id === 0
                            ? removePrimaryVisitor()
                            : removeVisitor(v.id)
                        }
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Delete Visitor"
                      >
                        <svg
                          width="10"
                          height="11"
                          viewBox="0 0 10 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.3125 9.625C1.3125 10.3495 1.90006 10.9375 2.625 10.9375H7C7.7245 10.9375 8.3125 10.3495 8.3125 9.625L9.1875 2.625H0.4375L1.3125 9.625ZM6.125 3.9375H7V9.625H6.125V3.9375ZM4.375 3.9375H5.25V9.625H4.375V3.9375ZM2.625 3.9375H3.5V9.625H2.625V3.9375ZM8.96875 0.875H6.125C6.125 0.875 5.929 0 5.6875 0H3.9375C3.69556 0 3.5 0.875 3.5 0.875H0.65625C0.293563 0.875 0 1.16856 0 1.53125C0 1.89394 0 2.1875 0 2.1875H9.625C9.625 2.1875 9.625 1.89394 9.625 1.53125C9.625 1.16856 9.331 0.875 8.96875 0.875Z"
                            fill="black"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          setExpandedVisitors((e) => ({ ...e, [v.id]: !e[v.id] }))
                        }
                        className="text-gray-600"
                        aria-label="Toggle"
                      >
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 19 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={`${expandedVisitors[v.id] ? "rotate-180" : ""} transition-transform`}
                        >
                          <path
                            d="M9.5 12.1923L4.75 7.44232L5.85833 6.33398L9.5 9.97565L13.1417 6.33398L14.25 7.44232L9.5 12.1923Z"
                            fill="#1D1B20"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {expandedVisitors[v.id] && (
                    <div className="p-3 space-y-3">
                      <div className="text-xs text-gray-600 font-medium">
                        Asset Category<span className="text-[#C72030]">*</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "IT",
                          "Mechanical",
                          "Electrical",
                          "Furniture",
                          "Other",
                          "Tool",
                          "Electronics",
                        ].map((c) => {
                          const selected =
                            (assetsByVisitor[v.id] || [])[0]?.category === c;
                          return (
                            <button
                              key={c}
                              type="button"
                              className={`px-3 py-1 border rounded text-sm whitespace-nowrap ${selected ? "bg-[#d8d3c6] border-[#d8d3c6] text-gray-800" : "bg-white border-gray-200"}`}
                              onClick={() => {
                                const list = assetsByVisitor[v.id] || [];
                                if (!list.length) {
                                  const asset = {
                                    id: 1,
                                    category: c,
                                    name: "",
                                    serial: "",
                                    notes: "",
                                    attachments: [],
                                  } as Asset;
                                  setAssetsByVisitor((s) => ({
                                    ...s,
                                    [v.id]: [asset],
                                  }));
                                } else {
                                  setAssetsByVisitor((s) => ({
                                    ...s,
                                    [v.id]: (s[v.id] || []).map((x, idx) =>
                                      idx === 0 ? { ...x, category: c } : x
                                    ),
                                  }));
                                }
                                // clear pure category error; name/serial may still show their own messages
                                setAssetCategoryErrors((e) => ({
                                  ...e,
                                  [v.id]: false,
                                }));
                              }}
                            >
                              {c}
                            </button>
                          );
                        })}
                      </div>
                      {/* Show category error only if this visitor currently has no category selected */}
                      {assetCategoryErrors[v.id] &&
                        !(assetsByVisitor[v.id] || [])[0]?.category?.trim() && (
                          <div className="text-xs text-[#C72030] mt-1">
                            Asset Category is required
                          </div>
                        )}

                      {(assetsByVisitor[v.id] || []).map((a) => (
                        <div
                          key={a.id}
                          className="border border-gray-100 rounded p-3"
                        >
                          <div>
                            <div className="text-xs text-gray-600">
                              Asset Name
                            </div>
                            <input
                              value={a.name}
                              onChange={(e) =>
                                setAssetsByVisitor((s) => ({
                                  ...s,
                                  [v.id]: (s[v.id] || []).map((x) =>
                                    x.id === a.id
                                      ? { ...x, name: e.target.value }
                                      : x
                                  ),
                                }))
                              }
                              className="mt-1 w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm"
                              placeholder="Enter name..."
                            />
                            {/* simple error helper when Step 3 validation failed for this visitor */}
                            {assetCategoryErrors[v.id] && !a.name?.trim() && (
                              <div className="mt-1 text-xs text-[#C72030]">
                                Asset Name is required
                              </div>
                            )}
                          </div>

                          <div className="mt-2">
                            <div className="text-xs text-gray-600">
                              Serial/Model No.
                            </div>
                            <input
                              value={a.serial}
                              onChange={(e) =>
                                setAssetsByVisitor((s) => ({
                                  ...s,
                                  [v.id]: (s[v.id] || []).map((x) =>
                                    x.id === a.id
                                      ? { ...x, serial: e.target.value }
                                      : x
                                  ),
                                }))
                              }
                              className="mt-1 w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm"
                              placeholder="Enter Serial no..."
                            />
                            {assetCategoryErrors[v.id] && !a.serial?.trim() && (
                              <div className="mt-1 text-xs text-[#C72030]">
                                Serial/Model No. is required
                              </div>
                            )}
                          </div>

                          <div className="mt-2">
                            <div className="text-xs text-gray-600">
                              Notes (Optional)
                            </div>
                            <textarea
                              value={a.notes}
                              onChange={(e) =>
                                setAssetsByVisitor((s) => ({
                                  ...s,
                                  [v.id]: (s[v.id] || []).map((x) =>
                                    x.id === a.id
                                      ? { ...x, notes: e.target.value }
                                      : x
                                  ),
                                }))
                              }
                              className="mt-1 w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm"
                              placeholder="Write your notes..."
                            />
                          </div>

                          <div className="mt-2">
                            <label className="inline-flex items-center px-3 py-2 border border-[#C72030] rounded text-sm text-[#C72030] cursor-pointer">
                              Attachment
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const url = URL.createObjectURL(file);
                                  setAssetsByVisitor((s) => ({
                                    ...s,
                                    [v.id]: (s[v.id] || []).map((x) =>
                                      x.id === a.id
                                        ? {
                                          ...x,
                                          attachments: [
                                            ...(x.attachments || []),
                                            { name: file.name, url, file },
                                          ],
                                        }
                                        : x
                                    ),
                                  }));
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2 items-center">
                            {(a.attachments || []).map((att, i) => (
                              <img
                                key={i}
                                src={att.url}
                                alt={att.name}
                                className="w-10 h-10 object-cover rounded border border-gray-200"
                              />
                            ))}
                          </div>

                          <div className="mt-2 flex justify-end">
                            <button
                              onClick={() =>
                                setAssetsByVisitor((s) => ({
                                  ...s,
                                  [v.id]: (s[v.id] || []).filter(
                                    (x) => x.id !== a.id
                                  ),
                                }))
                              }
                              className="text-sm text-red-600"
                            >
                              Remove Asset
                            </button>
                          </div>
                        </div>
                      ))}

                      <div>
                        <button
                          onClick={() => {
                            const list = assetsByVisitor[v.id] || [];
                            const nextId = list.length
                              ? list[list.length - 1].id + 1
                              : 1;
                            setAssetsByVisitor((s) => ({
                              ...s,
                              [v.id]: [
                                ...list,
                                {
                                  id: nextId,
                                  name: "",
                                  serial: "",
                                  notes: "",
                                  attachments: [],
                                },
                              ],
                            }));
                          }}
                          className="w-full border border-gray-200 py-2 rounded text-sm"
                        >
                          Add More Asset
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Identity Verification */}
        {step === 4 && (
          <div className="bg-white rounded shadow-sm p-2">
            <div className="p-3">
              {(
                [{ id: 0, name }, ...visitors] as Array<{
                  id: number;
                  name?: string;
                }>
              ).map((v) => (
                <div key={v.id} className="border border-gray-100 rounded mb-3">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#C72030] text-white flex items-center justify-center text-xs">
                        {v.id === 0 ? "V" : v.id}
                      </div>
                      <div className="text-sm font-medium">
                        {v.name ||
                          (v.id === 0 ? "Primary Visitor" : `Visitor ${v.id}`)}
                        {v.id === 0 && (
                          <span className="text-gray-400 text-xs">
                            {" "}
                            (Primary Visitor)
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setExpandedVisitors((e) => ({ ...e, [v.id]: !e[v.id] }))
                      }
                      className="text-gray-600"
                      aria-label="Toggle"
                    >
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${expandedVisitors[v.id] ? "rotate-180" : ""} transition-transform`}
                      >
                        <path
                          d="M9.5 12.1923L4.75 7.44232L5.85833 6.33398L9.5 9.97565L13.1417 6.33398L14.25 7.44232L9.5 12.1923Z"
                          fill="#1D1B20"
                        />
                      </svg>
                    </button>
                  </div>

                  {expandedVisitors[v.id] && (
                    <div className="p-3 space-y-3">
                      {/* ID type chips */}
                      <div className="flex flex-wrap gap-2">
                        {["PAN", "Aadhaar", "Passport", "Driving License"].map(
                          (idType) => {
                            const selected =
                              identityByVisitor[v.id]?.type === idType;
                            return (
                              <button
                                key={idType}
                                type="button"
                                onClick={() =>
                                  setIdentityByVisitor((s) => ({
                                    ...s,
                                    [v.id]: {
                                      ...(s[v.id] || {}),
                                      type: idType as IdentityState["type"],
                                    },
                                  }))
                                }
                                className={`px-3 py-1 border rounded text-sm ${selected ? "bg-[#d8d3c6] border-[#d8d3c6] text-gray-800" : "bg-white border-gray-200"}`}
                              >
                                {idType}
                              </button>
                            );
                          }
                        )}
                      </div>

                      {/* Upload first and second photo */}
                      <div>
                        <div className="text-xs text-gray-600 mb-2">
                          Upload ID (jpeg/png)
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {["First Photo", "Second Photo"].map(
                            (slotLabel, idx) => (
                              <div
                                key={idx}
                                className="relative border border-gray-200 rounded p-3 flex items-center justify-center h-24 bg-white"
                              >
                                {/* Preview if exists in identity documents (separate from asset attachments) */}
                                {(() => {
                                  const doc =
                                    identityByVisitor[v.id]?.documents?.[idx];
                                  if (doc) {
                                    return (
                                      <>
                                        <img
                                          src={doc.url}
                                          alt={doc.name}
                                          className="absolute inset-0 w-full h-full object-cover rounded"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setIdentityByVisitor((s) => ({
                                              ...s,
                                              [v.id]: {
                                                ...(s[v.id] || {}),
                                                documents: (
                                                  s[v.id]?.documents || []
                                                )
                                                  .map((d, i) =>
                                                    i === idx ? undefined : d
                                                  )
                                                  .filter(Boolean),
                                              },
                                            }));
                                          }}
                                          className="absolute top-1 right-1 text-gray-700"
                                          aria-label="Remove photo"
                                        >
                                          <svg
                                            width="10"
                                            height="11"
                                            viewBox="0 0 10 11"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M1.3125 9.625C1.3125 10.3495 1.90006 10.9375 2.625 10.9375H7C7.7245 10.9375 8.3125 10.3495 8.3125 9.625L9.1875 2.625H0.4375L1.3125 9.625ZM6.125 3.9375H7V9.625H6.125V3.9375ZM4.375 3.9375H5.25V9.625H4.375V3.9375ZM2.625 3.9375H3.5V9.625H2.625V3.9375ZM8.96875 0.875H6.125C6.125 0.875 5.929 0 5.6875 0H3.9375C3.69556 0 3.5 0.875 3.5 0.875H0.65625C0.293563 0.875 0 1.16856 0 1.53125C0 1.89394 0 2.1875 0 2.1875H9.625C9.625 2.1875 9.625 1.89394 9.625 1.53125C9.625 1.16856 9.331 0.875 8.96875 0.875Z"
                                              fill="black"
                                            />
                                          </svg>
                                        </button>
                                      </>
                                    );
                                  }
                                  return (
                                    <label className="flex flex-col items-center justify-center text-gray-500 cursor-pointer">
                                      <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M12 5v14M5 12h14"
                                          stroke="#9CA3AF"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                        />
                                      </svg>
                                      <span className="text-xs mt-1">
                                        {slotLabel}
                                      </span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (!file) return;
                                          const url = URL.createObjectURL(file);
                                          setIdentityByVisitor((s) => ({
                                            ...s,
                                            [v.id]: {
                                              ...(s[v.id] || {}),
                                              documents: [
                                                ...(s[v.id]?.documents || []),
                                                { name: file.name, url, file },
                                              ],
                                            },
                                          }));
                                        }}
                                      />
                                    </label>
                                  );
                                })()}
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* OR divider and Government ID field */}
                      <div className="my-3 flex items-center justify-center gap-2 text-gray-400">
                        <span className="inline-block w-20 border-t border-dashed border-gray-300" />
                        <span className="text-xs font-medium">OR</span>
                        <span className="inline-block w-20 border-t border-dashed border-gray-300" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">
                          Government ID No.
                        </div>
                        <input
                          value={identityByVisitor[v.id]?.govId || ""}
                          onChange={(e) =>
                            setIdentityByVisitor((s) => ({
                              ...s,
                              [v.id]: {
                                ...(s[v.id] || {}),
                                govId: e.target.value,
                              },
                            }))
                          }
                          className="mt-1 w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm"
                          placeholder="Enter ID Number..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fixed bottom actions */}
        <div className="fixed left-0 right-0 bottom-0 flex justify-center p-4 bg-white z-40 border-t border-gray-100">
          <div className="w-full max-w-xs sm:max-w-sm flex gap-3">
            {step > 1 && step !== 6 && !isSubmitting && !showSuccess && (
              <button
                onClick={() => {
                  // Clear validation errors when navigating back
                  setVisitorErrors({});
                  setPrimaryVehicleError(false);
                  setAssetCategoryErrors({});
                  setStep((s) => Math.max(1, s - 1));
                }}
                className="w-1/2 bg-white border border-gray-200 py-3 rounded"
              >
                Back
              </button>
            )}
            {step < 6 && (
              <button
                onClick={handleNext}
                disabled={step === 5 && !ndaAgree}
                className={`flex-1 py-3 font-semibold rounded ${step === 5 && !ndaAgree ? "bg-gray-300 text-white cursor-not-allowed" : "bg-[#C72030] text-white"}`}
              >
                {step === 5 ? "Preview" : "Next"}
              </button>
            )}
          </div>
        </div>
        {/* Small mobile API error card */}
        {apiError && (
          <div className="fixed left-1/2 bottom-24 z-50 sm:hidden transform -translate-x-1/2">
            <div className="w-64 bg-white border border-red-200 rounded shadow p-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="text-red-700 font-medium">API Error</div>
                <button
                  onClick={() => {
                    setApiError(null);
                    if (apiErrorTimerRef.current) {
                      window.clearTimeout(apiErrorTimerRef.current);
                      apiErrorTimerRef.current = null;
                    }
                  }}
                  className="text-gray-400"
                  aria-label="Dismiss"
                >
                  ×
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-700 break-words">
                {apiError}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorSharingFormWeb;
