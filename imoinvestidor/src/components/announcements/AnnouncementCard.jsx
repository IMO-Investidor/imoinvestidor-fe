import PropTypes from 'prop-types';
import { Eye, Edit3 } from 'lucide-react';
import placeholderImg from '@images/placeholder.jpg';
import { BaseCard } from '@common/BaseCard';
import { PriceBlock } from '@common/PriceBlock';
import { SelectorBadge } from '@common/SelectorBadge';

export function AnnouncementCard({
  announcement,
  onView,
  onEdit,
  actions = null,
  showView = true,
  showEdit = true,
  showStatus = true,
  hidePrice = false,
  selectionMode = false,
  onSelect,
  isSelected = false,
  className = '',
  viewStyle = 'icon', // 'icon' or 'button'
}) {
  const { property = {}, price, is_active } = announcement;

  const displayTitle =
    property.name || property.title || `Propriedade ${announcement.id}` || 'Sem título';

  // Fixed function to get the property image URL - matching PropertyCard pattern exactly
  const getImageUrl = () => {
    // First check if there's a direct imageUrl prop (like PropertyCard does)
    if (property?.imageUrl && property.imageUrl !== placeholderImg) {
      return property.imageUrl;
    }
    
    // Check if property has images array (similar to PropertyCard)
    if (property?.images && Array.isArray(property.images) && property.images.length > 0) {
      const imageItem = property.images[0];
      const url = imageItem.file || 
                  imageItem.url || 
                  imageItem.image || 
                  imageItem.file_url ||
                  imageItem.media_url ||
                  null;
      if (url) return url;
    }
    
    // Check for media array (following PropertyCard pattern)
    if (property?.media && property.media.length > 0) {
      const firstImage = property.media.find(media => media.media_type === 'image');
      if (firstImage?.file) {
        return firstImage.file;
      }
    }
    
    // Check for imagens array (your original structure)
    if (property?.imagens && Array.isArray(property.imagens) && property.imagens.length > 0) {
      const imageItem = property.imagens[0];
      const url = imageItem.file || 
                  imageItem.url || 
                  imageItem.image || 
                  imageItem.file_url ||
                  imageItem.media_url ||
                  null;
      if (url) return url;
    }
    
    // Check for single image property
    if (property?.image) {
      return property.image;
    }
    
    // Fallback to placeholder
    return placeholderImg;
  };

  return (
    <div
      className={`relative bg-white rounded-xl border-2 shadow-sm overflow-hidden ${
        isSelected
          ? 'border-[#CFAF5E] ring-2 ring-[#CFAF5E]/20 shadow-lg'
          : 'border-gray-200'
      } ${className}`}
      onClick={selectionMode ? onSelect : undefined}
    >
      <SelectorBadge isSelected={isSelected} />

      {/* Only show status badge if showStatus is true */}
      {showStatus && (
        <div
          className={`absolute top-2 left-2 z-10 px-2 py-0.5 text-xs font-semibold rounded shadow
          ${is_active
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-red-100 text-red-800 border border-red-300'}
        `}
        >
          {is_active ? 'Ativo' : 'Inativo'}
        </div>
      )}

      {actions && <div className="absolute top-2 right-2 z-10">{actions}</div>}

      <BaseCard
        title={displayTitle}
        tipologia={property.typology}
        casasBanho={property.num_wc}
        areaUtil={property.net_area}
        street={property.street}
        district={String(property.district_name || '')}
        imageUrl={getImageUrl()}
        imageClassName="h-48 sm:h-56"
      />

      <div className="p-4 sm:p-5 space-y-4">
        {/* Eye icon view - only show if viewStyle is 'icon' */}
        {viewStyle === 'icon' && (
          <div className="flex justify-between items-start">
            <div />
            {showView && onView && !selectionMode && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  onView(announcement);
                }}
                className="p-1 rounded-lg text-[#CFAF5E] hover:bg-[#CFAF5E]/10 transition"
                title="Ver anúncio"
              >
                <Eye size={18} />
              </button>
            )}
          </div>
        )}

        <PriceBlock
          hasRange={false}
          price={
            price != null
              ? `€${parseFloat(price).toLocaleString('pt-PT')}`
              : '-'
          }
          hidePrice={hidePrice}
          selectionMode={selectionMode}
        />

        {/* View Button - only show if viewStyle is 'button' */}
        {viewStyle === 'button' && !selectionMode && showView && onView && (
          <button
            onClick={e => {
              e.stopPropagation();
              onView(announcement);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0A2647] hover:bg-[#0A2647]/90 text-white font-semibold rounded-xl shadow transition-all text-sm"
          >
            <Eye size={16} />
            Ver Detalhes
          </button>
        )}

        {/* Edit Button */}
        {!selectionMode && showEdit && onEdit && (
          <button
            onClick={e => {
              e.stopPropagation();
              onEdit(announcement);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#CFAF5E] to-[#d4b565] text-[#0A2647] font-semibold rounded-xl shadow hover:scale-105 transition-all text-sm"
          >
            <Edit3 size={16} />
            Editar
          </button>
        )}

        {/* Selection Button */}
        {selectionMode && onSelect && (
          <button
            onClick={e => {
              e.stopPropagation();
              onSelect();
            }}
            className={`w-full py-2.5 px-4 rounded-xl font-medium ${
              isSelected
                ? 'bg-[#CFAF5E] text-white shadow-md'
                : 'bg-gray-100 text-[#0A2647] hover:bg-[#CFAF5E]/10'
            }`}
          >
            {isSelected ? 'Selecionado' : 'Selecionar'}
          </button>
        )}
      </div>
    </div>
  );
}

AnnouncementCard.propTypes = {
  announcement: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    is_active: PropTypes.bool,
    property: PropTypes.shape({
      title: PropTypes.string,
      name: PropTypes.string,
      typology: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      num_wc: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      net_area: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      street: PropTypes.string,
      district_name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      imageUrl: PropTypes.string, // Add this prop type
      imagens: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
      ]),
      images: PropTypes.array,
      media: PropTypes.array,
      image: PropTypes.string,
    }),
  }).isRequired,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  actions: PropTypes.node,
  showView: PropTypes.bool,
  showEdit: PropTypes.bool,
  showStatus: PropTypes.bool,
  hidePrice: PropTypes.bool,
  selectionMode: PropTypes.bool,
  onSelect: PropTypes.func,
  isSelected: PropTypes.bool,
  className: PropTypes.string,
  viewStyle: PropTypes.oneOf(['icon', 'button']),
};