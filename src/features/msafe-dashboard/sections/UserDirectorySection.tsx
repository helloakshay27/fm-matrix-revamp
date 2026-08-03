import { UserDirectoryCard } from '../components/UserDirectoryCard';

export function UserDirectorySection() {
  return (
    <div className="sec" id="sec-directory">
      <div className="sec-hd">
        <div className="sec-lbl">User Directory — Unified Compliance View</div>
        <div className="sec-line" />
      </div>
      <UserDirectoryCard />
    </div>
  );
}
