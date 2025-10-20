
import type React from 'react';

export interface UseCase {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface PCComponent {
  type: string;
  name: string;
  price: number;
  purchaseLink: string;
  justification: string;
}

export interface PCConfiguration {
  totalPrice: number;
  currency: string;
  components: PCComponent[];
}
