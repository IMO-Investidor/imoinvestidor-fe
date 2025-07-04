import PropTypes from "prop-types";
import { Search, MapPin, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdvancedSearchFilters from "@home/AdvancedSearchFilters";
import { buildPropertyFilters } from "@utils/filterUtils";

export default function HeroSearch({
  showAdvanced,
  setShowAdvanced,
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  destination = "announcements",
  isLoggedIn = false,
}) {
  const navigate = useNavigate();

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      tipo: "",
      tipologia: "",
      casasBanho: "",
      distrito: "",
      municipio: "",
      novaConstrucao: "",
      certificado: "",
      priceRange: [0, 2000000],
      areaUtilMin: "",
      areaUtilMax: "",
      areaBrutaMin: "",
      areaBrutaMax: "",
      extraInfos: [],
      roiMinimo: "",
    });
    setSearchTerm("");
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.tipo) count++;
    if (filters.tipologia) count++;
    if (filters.casasBanho) count++;
    if (filters.distrito) count++;
    if (filters.municipio) count++;
    if (filters.novaConstrucao) count++;
    if (filters.certificado) count++;
    if (filters.priceRange?.[0] > 0 || filters.priceRange?.[1] < 2000000) count++;
    if (filters.areaUtilMin) count++;
    if (filters.areaUtilMax) count++;
    if (filters.areaBrutaMin) count++;
    if (filters.areaBrutaMax) count++;
    if (filters.extraInfos?.length > 0) count++;
    if (filters.roiMinimo) count++;
    if (searchTerm.trim()) count++;
    return count;
  };

  const hasActiveFilters = () => getActiveFiltersCount() > 0;

  const handleSearch = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const searchFilters = {
      ...filters,
      searchTerm: searchTerm.trim(),
    };
    const queryParams = buildPropertyFilters(searchFilters);
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    navigate(`/${destination}?${searchParams.toString()}`);
  };

  return (
    <section className="pt-24 pb-16 px-8 bg-[#F5F5F5] text-center flex flex-col items-center justify-center gap-10 min-h-[40vh]">
      <div className="bg-white shadow-lg px-10 py-8 rounded-xl text-center w-full max-w-5xl mx-auto mb-10">
        <h3 className="text-2xl font-bold text-[#0A2647] mb-6">
          Explore oportunidades imobiliárias
        </h3>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Procurar imóveis por localização, código postal, referência..."
            className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-lg text-[#0A2647] focus:outline-none focus:ring-2 focus:ring-[#CFAF5E] focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-[#0A2647] transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center w-full gap-4 mb-4">
          <div className="order-2 sm:order-1 w-full sm:w-auto">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`text-sm px-6 py-3 rounded-lg w-full sm:w-auto transition-all duration-200 font-medium border-2 shadow-sm ${
                showAdvanced || hasActiveFilters()
                  ? "bg-[#0A2647] text-white border-[#0A2647] hover:bg-[#0d2e57] hover:border-[#0d2e57] shadow-md"
                  : "text-[#0A2647] bg-white border-[#0A2647] hover:bg-[#0A2647] hover:text-white"
              }`}
            >
              Pesquisa Avançada
              {hasActiveFilters() && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-[#0A2647] bg-[#CFAF5E] rounded-full min-w-[20px]">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
          </div>

          <div className="order-3 w-full sm:w-auto">
            <button
              onClick={handleSearch}
              className="bg-[#CFAF5E] text-white px-6 py-3 rounded-lg font-semibold w-full sm:w-auto hover:bg-[#b89a4e] transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="h-5 w-5" />
              Ver Imóveis
            </button>
          </div>
        </div>

        {hasActiveFilters() && !showAdvanced && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-[#0A2647]">Filtros Ativos:</h4>
              <button
                onClick={clearFilters}
                className="text-sm text-[#CFAF5E] hover:text-[#b89a4e] font-medium"
              >
                Limpar Todos
              </button>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-sm text-[#0A2647] rounded-md border">
                  Busca: "{searchTerm}"
                </span>
              )}
              {filters.tipo && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-sm text-[#0A2647] rounded-md border">
                  {filters.tipo}
                </span>
              )}
              {filters.tipologia && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-sm text-[#0A2647] rounded-md border">
                  {filters.tipologia}
                </span>
              )}
              {filters.casasBanho && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-sm text-[#0A2647] rounded-md border">
                  {filters.casasBanho} WC
                </span>
              )}
              {filters.distrito && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-sm text-[#0A2647] rounded-md border">
                  <MapPin className="h-3 w-3" />
                  Distrito
                </span>
              )}
              {filters.extraInfos?.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-sm text-[#0A2647] rounded-md border">
                  +{filters.extraInfos.length} comodidades
                </span>
              )}
              {(filters.priceRange?.[0] > 0 || filters.priceRange?.[1] < 2000000) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-sm text-[#0A2647] rounded-md border">
                  Intervalo de preço
                </span>
              )}
            </div>
          </div>
        )}

        {showAdvanced && (
          <AdvancedSearchFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
        )}
      </div>
    </section>
  );
}

HeroSearch.propTypes = {
  showAdvanced: PropTypes.bool.isRequired,
  setShowAdvanced: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  destination: PropTypes.string,
  isLoggedIn: PropTypes.bool,
};