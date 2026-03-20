import React, { useState } from 'react';
import { InvestigatorBlock, InvestigatorData } from './InvestigatorBlock';

interface InvestigatorRepeaterProps {
    internalUsers: any[];
    onInvestigatorsChange: (investigators: InvestigatorData[]) => void;
}

// Each block has a stable unique string ID so positional re-indexing never causes mismatches
interface BlockEntry {
    id: string;
    data: InvestigatorData | null;
}

let _uid = 0;
const nextId = () => `inv-block-${++_uid}-${Date.now()}`;

export const InvestigatorRepeater: React.FC<InvestigatorRepeaterProps> = ({
    internalUsers,
    onInvestigatorsChange
}) => {
    const [blocks, setBlocks] = useState<BlockEntry[]>([{ id: nextId(), data: null }]);

    const handleAddBlock = () => {
        setBlocks(prev => [...prev, { id: nextId(), data: null }]);
    };

    const handleRemoveBlock = (blockId: string) => {
        setBlocks(prev => {
            if (prev.length <= 1) return prev;
            const next = prev.filter(b => b.id !== blockId);
            // Notify parent with the remaining submitted data
            onInvestigatorsChange(next.map(b => b.data).filter(Boolean) as InvestigatorData[]);
            return next;
        });
    };

    const handleSubmit = (blockId: string, data: InvestigatorData) => {
        setBlocks(prev => {
            const next = prev.map(b => b.id === blockId ? { ...b, data } : b);
            onInvestigatorsChange(next.map(b => b.data).filter(Boolean) as InvestigatorData[]);
            return next;
        });
    };

    return (
        <div className="space-y-3">
            {blocks.map((block, index) => (
                <InvestigatorBlock
                    key={block.id}
                    index={index}
                    isLast={index === blocks.length - 1}
                    canRemove={blocks.length > 1}
                    onAddBlock={handleAddBlock}
                    onSubmit={(data) => handleSubmit(block.id, data)}
                    onRemove={() => handleRemoveBlock(block.id)}
                    internalUsers={internalUsers}
                />
            ))}
        </div>
    );
};
