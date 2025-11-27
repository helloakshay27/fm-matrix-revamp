import React, { useState, useEffect } from 'react';
import { InvestigatorBlock, InvestigatorData } from './InvestigatorBlock';

interface InvestigatorRepeaterProps {
    internalUsers: any[];
    onInvestigatorsChange: (investigators: InvestigatorData[]) => void;
}

export const InvestigatorRepeater: React.FC<InvestigatorRepeaterProps> = ({
    internalUsers,
    onInvestigatorsChange
}) => {
    const [blocks, setBlocks] = useState<number[]>([0]);
    const [investigators, setInvestigators] = useState<InvestigatorData[]>([]);

    const handleAddBlock = () => {
        setBlocks([...blocks, blocks.length]);
    };

    const handleRemoveBlock = (index: number) => {
        if (blocks.length > 1) {
            const newBlocks = blocks.filter((_, i) => i !== index);
            setBlocks(newBlocks);
            // Also remove the corresponding investigator data if it exists
            const newInvestigators = investigators.filter((_, i) => i !== index);
            setInvestigators(newInvestigators);
            onInvestigatorsChange(newInvestigators);
        }
    };

    const handleSubmit = (data: InvestigatorData) => {
        const updatedInvestigators = [...investigators, data];
        setInvestigators(updatedInvestigators);
        onInvestigatorsChange(updatedInvestigators);
    };

    return (
        <div className="space-y-3">
            {blocks.map((blockId, index) => (
                <InvestigatorBlock
                    key={blockId}
                    index={index}
                    isLast={index === blocks.length - 1}
                    canRemove={blocks.length > 1}
                    onAddBlock={handleAddBlock}
                    onSubmit={handleSubmit}
                    onRemove={() => handleRemoveBlock(index)}
                    internalUsers={internalUsers}
                />
            ))}
        </div>
    );
};
