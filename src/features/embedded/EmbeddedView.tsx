import { useAuthStore } from "@/stores/authStore";

interface EmbeddedViewProps {
  src: string;
}

const EmbeddedView = ({ src }: EmbeddedViewProps) => {
  const { user } = useAuthStore();
  const organizationId = user?.organizationId;
  const lockatedAccessToken = user?.lockatedAccessToken;

  if (!lockatedAccessToken || !organizationId) {
    return (
      <div
        className="flex h-full flex-col items-center justify-center gap-3"
        style={{ color: "var(--text-muted)" }}
      >
        <p className="text-sm">
          This view is only available for Lockated SSO users.
        </p>
        <p className="text-xs">
          Please sign in via your Lockated organisation to access this section.
        </p>
      </div>
    );
  }

  const url = `${src}?access_token=${encodeURIComponent(lockatedAccessToken)}&organization_id=${organizationId}&embedded=true`;

  return (
    <div className="w-full h-screen">
      <iframe
        src={url}
        className="w-full h-full border-0"
        title={src}
        allow="same-origin"
      />
    </div>
  );
};

export default EmbeddedView;
