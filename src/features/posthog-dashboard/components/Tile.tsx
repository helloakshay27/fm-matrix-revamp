import { INFO } from '../data/constants';
import { DeltaArrow } from './DeltaArrow';
import { InfoButton } from './InfoButton';
import type { TileSpec } from '../data/metrics';

export function Tile({ id, label, disp, delta, goodUp, sub }: TileSpec) {
  return (
    <div className="tile">
      <div className="tile-top">
        {id in INFO && <InfoButton infoKey={id} />}
        <div className="val">{disp}</div>
        {delta != null && <DeltaArrow delta={delta} goodUp={goodUp} />}
      </div>
      <div className="lbl">{label}</div>
      {sub && <div className="sub2">{sub}</div>}
    </div>
  );
}
