import type {
  CustomNotificationTargetDetail,
  NotificationTargetSelection,
} from "../types/customNotification";

// The backend can have more than one custom_notification_targets row pointing
// at the same targetable_id (confirmed duplicates seen in practice), but the
// UI only ever shows one checkbox/chip per targetable entity — so group by
// targetable_id and carry every matching row id along in targetRecordIds.
export function resolveNotificationTargets(
  targets: CustomNotificationTargetDetail[],
  targetableType: CustomNotificationTargetDetail["targetable_type"],
  nameLookup: Map<number, string>,
  fallbackLabel: string
): NotificationTargetSelection[] {
  const recordIdsByTargetableId = new Map<number, number[]>();
  targets
    .filter((t) => t.targetable_type === targetableType)
    .forEach((t) => {
      const ids = recordIdsByTargetableId.get(t.targetable_id) ?? [];
      ids.push(t.id);
      recordIdsByTargetableId.set(t.targetable_id, ids);
    });

  return Array.from(recordIdsByTargetableId.entries()).map(([targetableId, recordIds]) => ({
    id: targetableId,
    name: nameLookup.get(targetableId) ?? `${fallbackLabel} #${targetableId}`,
    targetRecordIds: recordIds,
  }));
}
