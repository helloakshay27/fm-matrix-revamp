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
        `${API_CONFIG.BASE_URL}/pms/associate_asset.json?token=${token}`,
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
      <DialogContent className="w-full max-w-[95vw] sm:max-w-6xl max-h-[90vh] overflow-auto">
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

        <div className="space-y-4 flex flex-col h-full">
          {/* Search */}
          <div className="flex justify-end">
            <div className="relative">
              <input
                type="text"
                className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Assets Table */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto border border-gray-200 rounded-lg">
              <table className="w-full table-auto">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Asset Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Group</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Sub-Group</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Meter</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Sub-Meter</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Associate As Parent</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Associate As Child</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{asset.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{asset.asset_group}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{asset.asset_sub_group}</td>
                      <td className="px-4 py-3 text-sm">
                        {asset.meter_tag_type === "SubMeter" && (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                            Sub Meter
                          </span>
                        )}
                        {asset.meter_tag_type === "ParentMeter" && !asset.parent_meter_id && (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            Parent Meter
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">Sub-Meter</td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="radio"
                          name="parent"
                          value={asset.id}
                          onChange={() => setParentId(asset.id)}
                          checked={parentId === asset.id}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          value={asset.id}
                          onChange={() => handleCheckboxChange(asset.id)}
                          checked={childIds.includes(asset.id)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                disabled={submitting || !assetId || (!parentId && childIds.length === 0)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700"
              >
                {submitting ? 'Processing...' : 'Done'}
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
          className="bg-purple-600 hover:bg-purple-700 text-white"
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
