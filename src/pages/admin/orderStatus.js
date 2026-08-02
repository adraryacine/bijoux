export const STATUS_META = {
  pending: { label: 'En attente', tint: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Confirmée', tint: 'bg-blue-100 text-blue-700' },
  shipped: { label: 'Expédiée', tint: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: 'Livrée', tint: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Annulée', tint: 'bg-red-100 text-red-600' },
}

export const STATUS_ORDER = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
