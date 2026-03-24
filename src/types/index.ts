/**
 * @file index.ts
 * @description Type definitions mapping the backend Data Transfer Objects (DTOs) for the frontend application.
 */

export interface Container {
  width: number;
  depth: number;
  height: number;
}

export interface Box {
  id: string;
  width: number;
  depth: number;
  height: number;
}

export interface PackRequest {
  container: Container;
  boxes: Box[];
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface PackedBox {
  box_id: string;
  position: Position;
  rotation_type: number;
  rotated_dimensions: [number, number, number];
}

export interface PackResponse {
  packed_boxes: PackedBox[];
}