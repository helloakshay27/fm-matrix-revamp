import React, { useEffect, useState } from 'react';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Search } from 'lucide-react';

interface AssetNode {
  id: number;
  name: string;
  breakdown?: boolean;
  children?: AssetNode[];
  parents?: AssetNode[];
  meter_tag_type?: string;
}

interface AssociationTabProps {
  asset: any;
  assetId: number;
}

interface AssociateAssetModalProps {
  show: boolean;
  onClose: () => void;
  assetId: number | null;
  assetName: string;
  pmsSiteId: string | number;
  assetGroupId: string | number;
  fetchData: () => void;
}

interface Asset {
  id: number;
  name: string;
  asset_number?: string;
  asset_group: string;
  asset_sub_group: string;
  meter_tag_type?: string;
  parent_meter_id?: number;
}

const AssociateAssetModal: React.FC<AssociateAssetModalProps> = ({
  show,
  onClose,
  assetId,
  assetName,
  pmsSiteId,
  assetGroupId,
  fetchData,
}) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [parentId, setParentId] = useState<number | null>(null);
  const [childIds, setChildIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchAssets = async () => {
    if (!show) return;

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/pms/assets.json?q[pms_asset_group_id_eq]=${assetGroupId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: getAuthHeader(),
          }
        }
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        setAssets(data);
      } else if (data.assets && Array.isArray(data.assets)) {
        setAssets(data.assets);
      } else {
        console.warn("Unexpected asset format:", data);
        setAssets([]);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      setAssets([]);
    }
  };

  const handleCheckboxChange = (id: number) => {
    setChildIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assetId) {
      alert("Invalid asset ID. Please close and reopen the modal.");
      return;
    }

    if (parentId === assetId || childIds.includes(assetId as number)) {
      alert("You cannot associate an asset with itself.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/pms/associate_asset.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: getAuthHeader(),
          },
          body: JSON.stringify({
            associate: {
              main_asset: assetId,
              parent_id: parentId,
              child_id: childIds,
            },
            url: `/pms/assets/${assetId}`,
          }),
        }
      );

      if (response.ok) {
        onClose();
        alert("Assets associated successfully.");
        fetchData();
        // Reset form
        setParentId(null);
        setChildIds([]);
        setSearchTerm("");
      } else {
        console.error('Failed to associate assets');
        alert("Failed to associate assets. Please try again.");
      }
    } catch (error) {
      console.error('Error associating assets:', error);
      alert("Failed to associate assets. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [show, pmsSiteId, assetGroupId]);

  if (!show) return null;

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredAssets = assets.filter((asset) => {
    if (!normalizedSearch) return true;
    const candidates = [
      asset.name,
      asset.asset_number,
      asset.asset_group,
      (asset as any).asset_group_name,
      asset.asset_sub_group,
      (asset as any).asset_sub_group_name,
      asset.meter_tag_type,
    ];
    return candidates.some((value) =>
      value?.toString().toLowerCase().includes(normalizedSearch)
    );
  });


  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="flex h-[min(82vh,760px)] w-full max-w-[95vw] flex-col overflow-hidden rounded-3xl p-7 sm:max-w-6xl">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">
            Associate Asset - {assetName}
          </DialogTitle>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4">
          {/* Search */}
          <div className="flex justify-end">
            <div className="relative w-full sm:w-[310px]">
              <input
                type="text"
                className="h-12 w-full rounded-2xl border border-gray-200 bg-white py-2 pl-11 pr-4 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                placeholder="Search assets"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Assets Table */}
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-auto rounded-2xl border border-gray-200">
              <table className="w-full min-w-[850px] table-auto">
                <thead className="sticky top-0 z-10 bg-[#f8f7f5]">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Group</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Sub-Group</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Meter</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Sub-Meter</th>
                    <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">As Parent</th>
                    <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">As Child</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="transition-colors hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-600">{asset.asset_group || "—"}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-600">{asset.asset_sub_group || "—"}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-600">
                        {asset.meter_tag_type === "ParentMeter" ? "Meter" : "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-600">
                        {asset.meter_tag_type === "SubMeter" ? "Sub-Meter" : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <input
                          type="radio"
                          name="parent"
                          value={asset.id}
                          onChange={() => setParentId(asset.id)}
                          checked={parentId === asset.id}
                          aria-label={`Associate ${asset.name} as parent`}
                          className="h-5 w-5 accent-neutral-900"
                        />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          value={asset.id}
                          onChange={() => handleCheckboxChange(asset.id)}
                          checked={childIds.includes(asset.id)}
                          aria-label={`Associate ${asset.name} as child`}
                          className="h-5 w-5 rounded accent-neutral-900"
                        />
                      </td>
                    </tr>
                  ))}
                  {filteredAssets.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500">
                        No assets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-12 rounded-xl border-gray-200 px-5 !text-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !assetId || (!parentId && childIds.length === 0)}
                className="h-12 rounded-xl bg-neutral-900 px-6 text-white hover:bg-neutral-800"
              >
                {submitting ? 'Processing...' : 'Associate'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const AssociationTab: React.FC<AssociationTabProps> = ({ asset, assetId }) => {
  const [hierarchyData, setHierarchyData] = useState<AssetNode | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<{ id: number | null; name: string }>({
    id: null,
    name: ''
  });
  const [loading, setLoading] = useState(false);

  const pmsSiteId = asset?.pms_site_id || "";
  const assetGroupId = asset?.pms_asset_group_id || "";

  const openModal = (id: number, name: string) => {
    setSelectedAsset({ id, name });
    setShowModal(true);
  };

  const openModalForCurrentAsset = () => {
    setSelectedAsset({ id: assetId, name: asset?.name || 'Current Asset' });
    setShowModal(true);
  };

  const renderAssetNode = (node: AssetNode, level: number = 0) => {
    const isBreakdown = node.breakdown === true;

    return (
      <div key={node.id} className="flex flex-col items-center">
        <div className="flex flex-col items-center">
          <div
            className={`
              flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer 
              min-w-[180px] min-h-[80px] text-center transition-all
              ${isBreakdown
                ? 'bg-red-500 text-white shadow-red-200'
                : 'bg-gradient-to-b from-white to-gray-50 shadow-lg hover:shadow-xl'
              } border border-gray-200 shadow-lg
            `}
            onClick={() => openModal(node.id, node.name)}
          >
            <span className="font-semibold text-sm">
              {node.name}
            </span>
            {node.meter_tag_type && (
              <span className={`text-xs mt-2 px-2 py-1 rounded-full ${isBreakdown
                ? 'bg-red-400 text-white'
                : 'bg-blue-100 text-blue-800'
                }`}>
                {node.meter_tag_type}
              </span>
            )}
          </div>

          {node.children && node.children.length > 0 && (
            <div className="w-0.5 h-8 bg-gray-300" />
          )}
        </div>

        {node.children && node.children.length > 0 && (
          <div className="relative">
            <div className="absolute left-0 right-0 -top-4 h-4 flex items-center justify-center">
              <div className="w-full h-0.5 bg-gray-300" />
            </div>
            <div className="flex gap-12 relative pt-4">
              {node.children.map((child, index) => (
                <div key={child.id} className="flex-1">
                  {renderAssetNode(child, level + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getRootNode = (data: AssetNode): AssetNode => {
    if (data.parents && data.parents.length > 0) {
      return getRootNode(data.parents[0]);
    }
    return data;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/pms/assets/hierarchy_tree_json.json?asset_id=${assetId}`,
        {
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );
      const data: AssetNode = await response.json();
      const rootNode = getRootNode(data);
      setHierarchyData(rootNode);
    } catch (error) {
      console.error('Error fetching association data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [assetId]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Asset Associations</h3>
        <Button
          onClick={openModalForCurrentAsset}
          variant="outline"
          className="h-[30px] px-3 py-0 rounded-[8px] border-[1.5px] border-[#2c2c2c] text-[#2c2c2c] text-[11.5px] font-semibold hover:bg-gray-50"
        >
          Associate Asset
        </Button>
      </div>

      <div className="border rounded-lg p-8 bg-white">
        {loading ? (
          <div className="text-center py-8">Loading association data...</div>
        ) : hierarchyData ? (
          <div className="overflow-x-auto min-w-full">
            <div className="min-w-[1200px] p-8">
              <h4 className="font-medium text-gray-700 mb-8 text-center">Asset Hierarchy Flow</h4>
              <div className="flex justify-center">
                {renderAssetNode(hierarchyData)}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No association data available
          </div>
        )}
      </div>

      {showModal && (
        <AssociateAssetModal
          show={showModal}
          onClose={() => setShowModal(false)}
          assetId={selectedAsset.id}
          assetName={selectedAsset.name}
          pmsSiteId={pmsSiteId}
          assetGroupId={assetGroupId}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};
