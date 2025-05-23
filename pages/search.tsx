import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import { useCart } from '../context/CartContext';
import AddToCartButton from './components/AddToCartButton';
import { calculateFinalPrice } from '../utils/calculateFinalPrice';
import { Bag } from '../utils/types';
import { useUser } from '../context/UserContext'; // Import useUser
import { handleAddToCartUtil } from "@/utils/addToCartUtil";
import '../styles/styles.css';
import Loading from './components/Loading'; // Importar el componente Loading

export default function SearchPage() {
  const router = useRouter();
  const { query } = router.query;
  const [results, setResults] = useState<Bag[]>([]);
  const { addToCart, cart } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { user } = useUser(); // Get user from context
  const [loading, setLoading] = useState(true); // Estado loading

  useEffect(() => {
    if (query) {
      (async () => {
        setLoading(true); // Inicia loading
        const response = await fetch(`/api/allPrices`);
        const data = await response.json();

        const filterBags = (
          bags: Bag[],
          isFb3x10 = false,
          isFb3x100 = false,
          isBaFdoKr = false,
          isBaFdoSu = false,
          isBoObr = false,
          isBoSu = false,
          isBoKr = false,
          isKraftManija = false,
          isBlancaManija = false,
          isPaManija = false, // Nuevo parámetro para PA
          isBoFae = false     // Nuevo parámetro para BoFae
        ) => {
          // Función para quitar acentos
          const normalize = (str: string) =>
            str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

          const queryString = normalize((query as string).toLowerCase());
          const queryWords = queryString.split(/\s+/);

          // Si es fb3x10 y la búsqueda es "fb3 x10" o "fast food x10", mostrar todos los fb3x10
          if (
            isFb3x10 &&
            (
              queryString.includes("fb3 x10") ||
              queryString.includes("fast food x10")
            )
          ) {
            return bags;
          }

          // Si es fb3x100 y la búsqueda es "fb3 x100" o "fast food x100", mostrar todos los fb3x100
          if (
            isFb3x100 &&
            (
              queryString.includes("fb3 x100") ||
              queryString.includes("fast food x100")
            )
          ) {
            return bags;
          }

          // Si es baKr y la búsqueda contiene "fondo", mostrar todos los baKr
          if (
            isBaFdoKr &&
            queryString.includes("fondo")
          ) {
            return bags;
          }

          // Si es baSu y la búsqueda contiene "fondo", mostrar todos los baSu
          if (
            isBaFdoSu &&
            queryString.includes("fondo")
          ) {
            return bags;
          }

          // Si es boObr y la búsqueda contiene "obra" o "bobinas", mostrar todos los boObr
          if (
            isBoObr &&
            (queryString.includes("obra") || queryString.includes("bobinas"))
          ) {
            return bags;
          }

          // Si es boSu y la búsqueda contiene "bobinas", mostrar todos los boSu
          if (
            isBoSu &&
            queryString.includes("bobinas sulfito")
          ) {
            return bags;
          }

          // Si es boKr y la búsqueda contiene "bobinas kraft", mostrar todos los boKr
          if (
            isBoKr &&
            queryString.includes("bobinas kraft")
          ) {
            return bags;
          }

          // Si es kraft con manija y la búsqueda contiene "bolsa(s) con manija", mostrar todos los kraft
          if (
            isKraftManija &&
            (
              (queryString.includes("bolsa con manija") || queryString.includes("bolsas con manija")
                || queryString.includes("bolsa con manija kraft")
                || queryString.includes("bolsas con manija kraft "))
              && !queryString.includes("bolsa con manija blanca")
              && !queryString.includes("bolsas con manija blanca")
              && !queryString.includes("bolsa con manija color")
              && !queryString.includes("bolsas con manija color")
              && !queryString.includes("bolsa con manija fantasia")
              && !queryString.includes("bolsas con manija fantasia")
            )
          ) {
            return bags;
          }

          // Si es blanca con manija y la búsqueda contiene "bolsa(s) con manija blancas", mostrar todos los blancas
          if (
            isBlancaManija &&
            (
              (
                queryString.includes("bolsa con manija blancas") ||
                queryString.includes("bolsas con manija blancas") ||
                queryString.includes("bolsa con manija") || // agregado
                queryString.includes("bolsas con manija")
              )
              && !queryString.includes("bolsa con manija kraft")
              && !queryString.includes("bolsas con manija kraft")
              && !queryString.includes("bolsa con manija color")
              && !queryString.includes("bolsas con manija color")
              && !queryString.includes("bolsa con manija fantasia")
              && !queryString.includes("bolsas con manija fantasia")
            )
          ) {
            return bags;
          }

          // Si es PA con manija y la búsqueda contiene "bolsa con manija color", mostrar todos los PA
          if (
            isPaManija &&
            (
              (
                queryString.includes("bolsa con manija color") ||
                queryString.includes("bolsas con manija color") ||
                queryString.includes("bolsa con manija") ||
                queryString.includes("bolsas con manija")
              )
              && !queryString.includes("bolsa con manija kraft")
              && !queryString.includes("bolsas con manija kraft")
              && !queryString.includes("bolsa con manija blanca")
              && !queryString.includes("bolsas con manija blanca")
              && !queryString.includes("bolsa con manija fantasia")
              && !queryString.includes("bolsas con manija fantasia")
            )
          ) {
            return bags;
          }

          // Si es boFae y la búsqueda contiene "bolsa con manija fantasia", mostrar todos los boFae
          if (
            isBoFae &&
            (
              (
                queryString.includes("bolsa con manija fantasia") ||
                queryString.includes("bolsas con manija fantasia") ||
                queryString.includes("bolsa con manija") ||
                queryString.includes("bolsas con manija")
              )
              && !queryString.includes("bolsa con manija kraft")
              && !queryString.includes("bolsas con manija kraft")
              && !queryString.includes("bolsa con manija blanca")
              && !queryString.includes("bolsas con manija blanca")
              && !queryString.includes("bolsa con manija color")
              && !queryString.includes("bolsas con manija color")
            )
          ) {
            return bags;
          }

          return bags.filter((bag: Bag) => {
            const combinedText = normalize(
              `${bag.description} ${bag.additionalDescription || ''}`.toLowerCase()
            );
            return queryWords.every((word) => combinedText.includes(word));
          });
        };

        // Ordenar baSu según el arreglo dado
        const orderBaSu = ["BAS3", "BAS4", "BAS4A", "BAS5", "BAS6", "BAS6L", "BAS7"];
        const orderedBaSu = [...data.baSu].sort((a, b) => {
          const aIndex = orderBaSu.indexOf(a.systemCode);
          const bIndex = orderBaSu.indexOf(b.systemCode);
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });

        // Ordenar boSu según el arreglo dado por el usuario
        const orderBoSu = [
          "BSF370201", "BSF600201", "BSF370202", "BSF600202", "BSF370203", "BSF600203",
          "BSF370101", "BSF600101",
          "BSF370201", "BSF600201", "BSF370102", "BSF600102", "BSF370103", "BSF600103",
          "BSF370401", "BSF600401", "BSF370402", "BSF600402", "BSF370403", "BSF600403",
          "BSF370404", "BSF600404", "BSF370604", "BSF600604", "BSF370601", "BSF600601",
          "BSF370603", "BSF600603", "BSF370602", "BSF600602", "BSF370704", "BSF600704",
          "BSF370701", "BSF600701", "BSF370703", "BSF600703", "BSF370702", "BSF600702",
          "BSF370501", "BSF600501"
        ];
        const orderedBoSu = [...data.boSu].sort((a, b) => {
          const aIndex = orderBoSu.indexOf(a.systemCode);
          const bIndex = orderBoSu.indexOf(b.systemCode);
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });

        // Ordenar boKr según el arreglo dado por el usuario
        const orderBoKr = [
          "BKF370101", "BKF600101", "BKF370102", "BKF600102", "BKF370103", "BKF600103",
          "BKF370201", "BKF600201", "BKF370202", "BKF600202", "BKF370203", "BKF600203",
          "BKF370701", "BKF600701", "BKF370702", "BKF600702", "BKF370703", "BKF600703",
          "BKF370704", "BKF600704", "BKF370501", "BKF600501", "BKF370502", "BKF600502",
          "BLD4013N", "BLD6017N", "BLD4039L", "BLD6047L", "BKF370401", "BKF600401",
          "BKF370402", "BKF600402", "BLD4039B", "BLD6047B", "BLD4039M", "BLD6047M",
          "BKF370601", "BKF600601", "BKF370603", "BKF600603", "BKF370602", "BKF600602"
        ];



        const orderedBoKr = [...data.boKr].sort((a, b) => {
          const aIndex = orderBoKr.indexOf(a.systemCode);
          const bIndex = orderBoKr.indexOf(b.systemCode);
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });

        // Ordenar baKr según el arreglo dado
        const order = ["BAK2", "BAK3", "BAK4", "BAK4A", "BAK5", "BAK6", "BAK6L", "BAK7"];
        const orderedBaKr = [...data.baKr].sort((a, b) => {
          const aIndex = order.indexOf(a.systemCode);
          const bIndex = order.indexOf(b.systemCode);
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });

        // Ordenar pa según el arreglo dado
        const orderPa = [
          "BG1P001", "BG1P002", "BG1P003", "BG1P004", "BG1P00S",
          "BG3P001", "BG3P002", "BG3P003", "BG3P004", "BG3P00S",
          "BG5P001", "BG5P002", "BG5P003", "BG5P004", "BG5P00S"
        ];
        const orderedPa = [...data.pa].sort((a, b) => {
          const aIndex = orderPa.indexOf(a.systemCode);
          const bIndex = orderPa.indexOf(b.systemCode);
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });

        // Ordenar boFae según prefijo G1, G3, G5 en la descripción
        const orderBoFaePrefix = ["G1", "G3", "G5"];
        const orderedBoFae = [...data.boFae].sort((a, b) => {
          const aPrefix = a.description.slice(0, 2);
          const bPrefix = b.description.slice(0, 2);
          const aIndex = orderBoFaePrefix.indexOf(aPrefix);
          const bIndex = orderBoFaePrefix.indexOf(bPrefix);

          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          } else if (aIndex !== -1) {
            return -1;
          } else if (bIndex !== -1) {
            return 1;
          } else {
            return aPrefix.localeCompare(bPrefix);
          }
        });

        const orderBoObr = [
          "BLD4001201", "BLD6001201", "BLD4001203", "BLD6001203", "BLD4001202", "BLD6001202", "BLD4001204", "BLD6001204",
          "BLD4001401", "BLD6001401", "BLD4001403", "BLD6001403", "BLD4001402", "BLD6001402", "BLD4001404", "BLD6001404",
          "BLD4001301", "BLD6001301", "BLD4001303", "BLD6001303", "BLD4001302", "BLD6001302", "BLD4001304", "BLD6001304",
          "BLD4001102", "BLD6001102", "BLD4001103", "BLD6001103", "BLD4001104", "BLD6001104", "BLD4040", "BLD6050",
          "BLD4042", "BLD6048", "BLD4041", "BLD6049", "BLD4043", "BLD6051", "BLD4001501", "BLD6001501", "BLD4001503",
          "BLD6001503", "BLD4001502", "BLD6001502", "BLD4001504", "BLD6001504", "BLD4000405", "BLD6000405", "BLD4000406",
          "BLD6000406", "BLD4000407", "BLD6000407"
        ];

        const sortedBoObr = [...filterBags(data.boObr, false, false, false, false, true)].sort((a, b) => {
          const aIndex = orderBoObr.indexOf(a.systemCode);
          const bIndex = orderBoObr.indexOf(b.systemCode);
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });

        const queryString = (query as string).toLowerCase();

        // Si la búsqueda es "bobinas sulfito" o "bobinas kraft", no mostrar resultados de data.boObr
        const showBoObr = !queryString.includes("bobinas sulfito") && !queryString.includes("bobinas kraft");

        const filteredResults = [
          ...(showBoObr ? sortedBoObr.map((bag: Bag) => ({ ...bag, source: 'boObr' })) : []),
          ...filterBags(orderedBoSu, false, false, false, false, false, true).map((bag: Bag) => ({
            ...bag,
            description: bag.description.replace(/x 140 mts/gi, '').replace(/Fantasía/gi, '').trim(),
            source: 'boSu'
          })),
          ...filterBags(orderedBaSu, false, false, true).map((bag: Bag) => ({
            ...bag,
            source: 'baSu'
          })),
          ...filterBags(orderedBaKr, false, false, true).map((bag: Bag) => ({
            ...bag,
            source: 'baKr'
          })),
          ...filterBags(orderedBoKr, false, false, false, false, false, false, true).map((bag: Bag) => ({
            ...bag,
            source: 'boKr'
          })),
          ...filterBags(data.kraft, false, false, false, false, false, false, false, true),
          ...filterBags(data.blancas, false, false, false, false, false, false, false, false, true),
          ...filterBags(orderedPa, false, false, false, false, false, false, false, false, false, true),
          ...filterBags(orderedBoFae, false, false, false, false, false, false, false, false, false, false, true),
          ...filterBags(data.fb3x100, false, true),
          ...(
            queryString.includes("fb3 x100") || queryString.includes("fast food x100")
              ? []
              : filterBags(data.fb3x10, true)
          ),
          ...filterBags(data.fantFb3x100),
          ...filterBags(
            data.fm.map((bag: Bag) => ({
              ...bag,
              isFM: true, // Marca las bolsas FM
            }))
          ),
        ];

        setResults(filteredResults);
        setLoading(false); // Finaliza loading
      })();
    }
  }, [query]);

  const handleIncrement = (systemCode: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [systemCode]: (prevQuantities[systemCode] || 0) + 1,
    }));
  };

  const handleDecrement = (systemCode: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [systemCode]: Math.max((prevQuantities[systemCode] || 0) - 1, 0),
    }));
  };

  const handleQuantityChange = (systemCode: string, value: string) => {
    const numberValue = parseInt(value, 10);
    if (!isNaN(numberValue) && numberValue >= 0) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [systemCode]: numberValue,
      }));
    }
  };

  const handleAddToCart = (systemCode: string, description: string, list4: number) => {
    handleAddToCartUtil(
      systemCode,
      description,
      list4,
      results,
      user.priceList,
      quantities,
      addToCart,
      setQuantities
    );
  };

  const calculateDiscountedPrice = (price: number, systemCode: string) => {
    const eligibleSystemCodesFb3 = [
      "BFB3F53", "BFB3F54", "BFB3F45", "BFB3F40", "BFB3F57", "BFB3F50",
      "BFB3F36", "BFB3F41", "BFB3F38", "BFB3F58", "BFB301", "BFB3F44",
      "BFB3F56", "BFB3F52", "BFB3F51", "BFM301", "BFB3F39"
    ];

    const eligibleSystemCodesFb310 = [
      "BFB3P133", "BFB3P113", "BFB3P122", "BFB3P10", "BFB3P114", "BFB3P116",
      "BFB3P126", "BFB3P115", "BFB3P132", "BFB3P125", "BFB3P112", "BFM3P10",
      "BFB3P117", "BFB3P124", "BFB3P123", "BFB3P134", "BFB3P160"
    ];

    const eligibleSystemCodesFb3Fant = [
      "BFB3F81",
      "BFB3F79",
      "BFB3F76",
      "BFB3F82",
      "BFB3F73",
      "BFB3F78",
      "BFB3F74",
      "BFB3F75",
      "BFB3F80",
      "BFB3F77"
    ];

    const totalEligibleItems = Object.values(cart)
      .filter((item) =>
        eligibleSystemCodesFb3.includes(item.code) ||
        eligibleSystemCodesFb3Fant.includes(item.code)
      )
      .reduce((sum, item) => sum + item.quantity, 0);

    const totalEligibleItems10 = Object.values(cart)
      .filter((item) => eligibleSystemCodesFb310.includes(item.code))
      .reduce((sum, item) => sum + item.quantity, 0);

    if (
      (
        (eligibleSystemCodesFb3.includes(systemCode) ||
          eligibleSystemCodesFb3Fant.includes(systemCode)
        ) && totalEligibleItems >= 100
      ) ||
      (eligibleSystemCodesFb310.includes(systemCode) && totalEligibleItems10 >= 100)
    ) {
      return price * 0.9;
    }
    return price;
  };

  if (!user) {
    return null; // Ensure user is loaded before rendering
  }

  return (
    <div>
      <NavBar />
      <main className="main" style={{ marginTop: '4rem' }}>
        {loading ? (
          <Loading />
        ) : (
          <div className="flex flex-wrap justify-evenly">
            {results.length > 0 ? (
              results.map((bag, index) => (
                <div
                  className="relative m-4 p-2 pb-5 rounded-2xl shadow-lg bg-white hover:shadow-2xl max-w-sm"
                  key={index}
                >
                  <img
                    className="w-72 h-36 object-contain mx-auto block"
                    src={
                      results.some((b: Bag) => b.systemCode === bag.systemCode && (
                        b.description.toLowerCase().includes("fast food fb3 pleno x 100 u.") ||
                        b.systemCode.toLowerCase().includes("bfm301") ||
                        b.description.toLowerCase().includes("fast food fb3 blanca x 100 u.")
                      ))
                        ? `/Bolsa Fast Food FB3 Pleno ${bag.additionalDescription || bag.systemCode}.png`
                        : results.some((b: Bag) =>
                          b.systemCode === bag.systemCode && (
                            b.description.toLowerCase().includes("fast food fb3 blanca x 10 u.") ||
                            b.description.toLowerCase().includes("fast food fb3 pleno x 10 u.") ||
                            b.systemCode.toLowerCase().includes("bfm3p10")
                          )
                        )
                          ? `/BOLSA FAST FOOD FB3 PLENO X 10 U. ${bag.additionalDescription || bag.systemCode}.jpg`
                          : results.some((b: Bag) =>
                            b.systemCode === bag.systemCode &&
                            b.description.toLowerCase().includes("fast food fb3 fantasía")
                          )
                            ? `/Bolsa Fast Food FB3 Fantasia x 100 u. ${bag.additionalDescription}.png`
                            : results.some((b: Bag) => b.systemCode === bag.systemCode && b.description.toLowerCase().includes("blanca"))
                              ? "/bolsas-blancas.jpg"
                              : results.some(
                                (b: Bag) =>
                                  b.systemCode === bag.systemCode &&
                                  (
                                    b.description.toLowerCase().includes("bobina kraft") ||
                                    b.description.toLowerCase().includes("bobina fantasia marron")
                                  )
                              )
                                ? `/Bobina Kraft ${bag.additionalDescription}.png`
                                : results.some((b: Bag) => b.systemCode === bag.systemCode && b.description.toLowerCase().includes("bobina sulfito"))
                                  ? `/Bobina Sulfito ${bag.additionalDescription}.png`
                                  : results.some((b: Bag) => b.systemCode === bag.systemCode && b.description.toLowerCase().includes("bobina"))
                                    ? `/Bobina Obra ${bag.additionalDescription}.png`
                                    : results.some((b: Bag) => b.systemCode === bag.systemCode && b.description.toLowerCase().includes("fdo americano kraft"))
                                      ? "/bolsa-fondo-americano-kraft.png"
                                      : results.some((b: Bag) => b.systemCode === bag.systemCode && b.description.toLowerCase().includes("fdo americano sulfito"))
                                        ? "/bolsa-fondo-americano-sulfito.png"
                                        : results.some((b: Bag) => b.systemCode === bag.systemCode && b.description.toLowerCase().includes("pa"))
                                          ? `/Bolsa de Color ${bag.additionalDescription}.jpg`
                                          : results.some((b: Bag) => b.systemCode === bag.systemCode && b.description.toLowerCase().includes("fantasia"))
                                            ? `/Bolsa Fantasia ${bag.additionalDescription}.png`
                                            : results.some((b: Bag) => b.systemCode === bag.systemCode && b.description.toLowerCase().includes("fast food fm"))
                                              ? `/Bolsa Fast Food ${bag.systemCode}.png`
                                              : results.some((b: Bag) => b.systemCode === bag.systemCode && b.description.toLowerCase().includes("kraft"))
                                                ? "/bolsas-kraft.jpg"
                                                : ""
                    }
                    alt={
                      results.some((b: Bag) => b.systemCode === bag.systemCode && b.description.toLowerCase().includes("pa"))
                        ? `Bolsa de Color ${bag.description.replace(/Bolsas\s*/i, '')}`
                        : bag.description || "Bolsa"
                    }
                  />
                  <div className="container mx-auto p-2">
                    <div className="flex flex-col">
                      <div className="overflow-x-auto">
                        <div className="py-2 inline-block min-w-full">
                          <div className="overflow-hidden">
                            <table className="min-w-full table-fixed">
                              <thead className="border-b">
                                <tr>
                                  <th scope="col" className="w-1/4 text-base font-medium text-gray-900 px-2 py-2 text-center">
                                    Descripción & Medidas
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b">
                                  <td className="px-2 py-2 whitespace-normal break-words text-base font-medium text-gray-900 text-center align-middle">
                                    {
                                      bag.source === 'boSu'
                                        ? (() => {
                                          // Busca "cm" y agrega un salto de línea después de la primera ocurrencia
                                          const desc = `${bag.description}${bag.additionalDescription ? ' ' + bag.additionalDescription : ''}`;
                                          const cmIndex = desc.indexOf('cm');
                                          if (cmIndex !== -1) {
                                            return (
                                              <>
                                                {desc.substring(0, cmIndex + 2)}
                                                <br />
                                                {desc.substring(cmIndex + 2).trim()}
                                              </>
                                            );
                                          }
                                          return desc;
                                        })()
                                        : bag.source === 'boKr'
                                          ? (
                                            <>
                                              {bag.description.replace(/x 140 mts/gi, '').trim()}
                                              {bag.additionalDescription && (
                                                <>
                                                  <br />
                                                  {bag.additionalDescription.replace(/x 140 mts/gi, '').trim()}
                                                </>
                                              )}
                                            </>
                                          )
                                          : bag.description.replace(/\bBolsa(s)?\b\s*/i, '')
                                    }
                                    {bag.source === 'boObr' && <br />}
                                    {bag.source === 'boObr' && bag.additionalDescription ? ` ${bag.additionalDescription}` : ''}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mb-2">
                    <p className="text-gray-700 text-lg">
                      {
                        bag.isFM
                          ? "Precio x1000: "
                          : bag.source === 'boObr' || bag.source === 'boSu' || bag.source === 'boKr'
                            ? "Precio x und. :"
                            : bag.source === 'baSu' || bag.source === 'baKr'
                              ? "Precio x1000: "
                              : "Precio x100: "
                      }
                      <span className="font-bold">
                        {(() => {
                          const finalPriceString = calculateFinalPrice(user.priceList, bag);
                          const finalPrice = parseFloat(finalPriceString.replace('$', '')); // Extract numeric value
                          return `$${Math.floor(calculateDiscountedPrice(finalPrice, bag.systemCode))}`; // Round down
                        })()}
                      </span>
                    </p>
                  </div>
                  <div className="px-4 py-1">
                    <div className="w-full bg-gray-200 p-1 rounded-lg">
                      <div className="flex items-center justify-between">
                        <button className="px-8 py-1 rounded-l text-black" onClick={() => handleDecrement(bag.systemCode)}>-</button>
                        <input
                          type="number"
                          className="w-16 text-center bg-gray-200 no-arrows text-black"
                          value={quantities[bag.systemCode] || 0}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              setQuantities((prevQuantities) => ({
                                ...prevQuantities,
                                [bag.systemCode]: 0,
                              }));
                            } else {
                              handleQuantityChange(bag.systemCode, value);
                            }
                          }}
                          onFocus={(e) => e.target.select()}
                        />
                        <button className="px-8 py-1 rounded-r text-black" onClick={() => handleIncrement(bag.systemCode)}>+</button>
                      </div>
                    </div>
                    <AddToCartButton
                      systemCode={bag.systemCode}
                      description={bag.description}
                      list4={bag.list4}
                      quantity={quantities[bag.systemCode] || 0}
                      handleAddToCart={handleAddToCart} list3={0} list2={0} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No se encontraron resultados.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}