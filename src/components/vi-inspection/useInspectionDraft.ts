import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Structured cloning in IndexedDB preserves File objects, including attachment bytes.
export async function inspectionDraftStorage<T>(key: string, operation: "read" | "save" | "delete", value?: T): Promise<T | undefined> {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("vi-inspection-drafts", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("drafts");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  try {
    return await new Promise<T | undefined>((resolve, reject) => {
      const tx = db.transaction("drafts", operation === "read" ? "readonly" : "readwrite");
      const store = tx.objectStore("drafts");
      const request = operation === "read" ? store.get(key) : operation === "save" ? store.put(value, key) : store.delete(key);
      tx.oncomplete = () => resolve(operation === "read" ? request.result : undefined);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error ?? new Error("Draft transaction aborted"));
    });
  } finally {
    db.close();
  }
}

export function useInspectionDraft<T>(form: string, initial: () => T) {
  const initialRef = useRef(initial);
  initialRef.current = initial;
  const [value, setValue] = useState(initial);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const key = JSON.stringify([localStorage.getItem("baseUrl"), user?.id ?? user?.email, form]);
  const loading = loadedKey !== key;

  useEffect(() => {
    let active = true;
    setError(false);
    inspectionDraftStorage<T>(key, "read")
      .then((draft) => {
        if (!active) return;
        setValue(draft ?? initialRef.current());
        setLoadedKey(key);
      })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [key, attempt]);

  const persist = async (operation: "save" | "delete") => {
    if (loading || error || busy.current) return false;
    busy.current = true;
    setSaving(true);
    try {
      await inspectionDraftStorage(key, operation, value);
      return true;
    } catch {
      toast.error("Unable to save changes. Your form is still available; please try again.");
      return false;
    } finally {
      busy.current = false;
      setSaving(false);
    }
  };
  return { value, setValue, loading, error, saving, retry: () => setAttempt((n) => n + 1),
    saveDraft: () => persist("save"), clearDraft: () => persist("delete") };
}
