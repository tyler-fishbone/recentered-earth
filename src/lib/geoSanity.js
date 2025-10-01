import { geoMercator } from "d3-geo";

export function projectZero() {
  // arbitrary viewport so we get a concrete pixel result
  const proj = geoMercator().translate([400, 250]).scale(200);
  return proj([0, 0]); // pixel coords of (lon=0, lat=0)
}
