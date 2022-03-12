export const positionStringify = (position: {longitude: number; latitude: number}): string =>
    `${position.latitude}, ${position.longitude}`;
