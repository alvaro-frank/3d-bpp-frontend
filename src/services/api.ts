/**
 * @file api.ts
 * @description Service layer for handling HTTP communication with the FastAPI backend.
 */

import type { PackRequest, PackResponse } from '../types';

/**
 * Sends the container and boxes data to the backend to calculate the optimal 3D packing plan.
 * * @param {PackRequest} payload - The container dimensions and list of boxes to be packed.
 * @returns {Promise<PackResponse>} The calculated packing plan containing positions and rotations.
 * @throws {Error} When the HTTP response indicates a failure or the network request aborts.
 */
export const fetchPackingPlan = async (payload: PackRequest): Promise<PackResponse> => {
  const response = await fetch('/api/pack', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch packing plan from the server.');
  }

  return response.json();
};