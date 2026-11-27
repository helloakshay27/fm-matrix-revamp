import { useState, type CSSProperties } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { buildVCard, downloadVCard, isSavableContact, loadVCardPhoto, type VCardContact } from "@/utils/vCard";

interface SaveContactButtonProps {
  /** Contact from the card's API data; null while it is still loading. */
  contact: VCardContact | null;
  /** Profile photo to embed in the contact (optional). */
  photoUrl?: string;
  className?: string;
  style?: CSSProperties;
}

// "Save Contact" for a digital business card: builds a vCard from the card's data and downloads it
// as a .vcf, which the visitor's phone / computer then offers to add to their contacts. Nothing is
// added to the phonebook without the visitor confirming it there.
export const SaveContactButton = ({ contact, photoUrl, className, style }: SaveContactButtonProps) => {
  const [saving, setSaving] = useState(false);
  const ready = Boolean(contact && isSavableContact(contact));

  const handleSave = async () => {
    if (!contact || saving) return;
    if (!isSavableContact(contact)) {
      toast.error("This card has no contact details to save");
      return;
    }
    setSaving(true);
    try {
      const photo = photoUrl ? await loadVCardPhoto(photoUrl) : undefined;
      const fileName = contact.fullName.trim().replace(/[^\w.-]+/g, "_") || "contact";
      downloadVCard(buildVCard({ ...contact, photo }), fileName);
      toast.success("Contact file downloaded", {
        description: "Open the downloaded .vcf file and choose Add / Create contact to save it.",
      });
    } catch (error) {
      console.error("Save contact failed:", error);
      toast.error("Could not save the contact. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={!ready || saving}
      aria-label={contact ? `Save ${contact.fullName} to contacts` : "Save contact"}
      aria-busy={saving}
      className={className}
      style={style}
    >
      {saving || !contact ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
      {saving ? "Saving..." : "Save Contact"}
    </button>
  );
};
