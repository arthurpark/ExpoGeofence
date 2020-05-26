type Scale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const scaleValues = [0, 2, 4, 8, 16, 24, 32, 64];

function getScaleValue(scale: Scale) {
  return scaleValues[scale];
}

type Spacing = {
  a?: Scale;
  h?: Scale;
  v?: Scale;
  t?: Scale;
  b?: Scale;
  l?: Scale;
  r?: Scale;
};

export function resolvePadding(spacing?: Spacing) {
  if (!spacing) {
    return undefined;
  }

  const { a, h, v, t, b, l, r } = spacing;

  const top = t ?? v ?? a;
  const bottom = b ?? v ?? a;
  const left = l ?? h ?? a;
  const right = r ?? h ?? a;

  return {
    paddingTop: getScaleValue(top),
    paddingBottom: getScaleValue(bottom),
    paddingLeft: getScaleValue(left),
    paddingRight: getScaleValue(right),
  };
}

export function resolveMargin(spacing?: Spacing) {
  if (!spacing) {
    return undefined;
  }

  const { a, h, v, t, b, l, r } = spacing;

  const top = t ?? v ?? a;
  const bottom = b ?? v ?? a;
  const left = l ?? h ?? a;
  const right = r ?? h ?? a;

  return {
    marginTop: getScaleValue(top),
    marginBottom: getScaleValue(bottom),
    marginLeft: getScaleValue(left),
    marginRight: getScaleValue(right),
  };
}
