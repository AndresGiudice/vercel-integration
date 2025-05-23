// components/NavBar.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, ChevronDownIcon, XMarkIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Add MagnifyingGlassIcon import
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext'; // Assuming you have a UserContext
import axios from 'axios';
import withAuth from '../../components/withAuth';
import { useRouter } from 'next/router';

const placeOrder = async (cart: any, totalAmount: number, user: any, clearCart: () => void) => { // Add user parameter
  try {
    await axios.post('/api/sendOrderEmail', { cart, totalAmount, user }); // Include user in the request body
    alert('Pedido realizado con éxito!');
    clearCart();
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    alert('Hubo un error al realizar el pedido. Por favor, inténtalo de nuevo.');
  }
};

const restrictedPriceLists: { [key: string]: string[] } = {
  'lista4': ['lista4-final', 'lista4-10', 'lista4-10-2', 'lista4-10-final', 'lista4-10-2-final', 'lista3', 'lista3-final', 'lista3-10', 'lista3-10-2', 'lista3-10-final', 'lista3-10-2-final', 'lista2', 'lista2-10', 'lista2-10-2', 'lista2-final', 'lista2-10-final', 'lista2-10-2-final'],
  'lista4-10': ['lista4', 'lista4-final', 'lista4-10-2', 'lista4-10-final', 'lista4-10-2-final', 'lista3', 'lista3-final', 'lista3-10', 'lista3-10-2', 'lista3-10-final', 'lista3-10-2-final', 'lista2', 'lista2-10', 'lista2-10-2', 'lista2-final', 'lista2-10-final', 'lista2-10-2-final'],
  'lista4-10-2': ['lista4', 'lista4-final', 'lista4-10', 'lista4-10-final', 'lista4-10-2-final', 'lista3', 'lista3-final', 'lista3-10', 'lista3-10-2', 'lista3-10-final', 'lista3-10-2-final', 'lista2', 'lista2-10', 'lista2-10-2', 'lista2-final', 'lista2-10-final', 'lista2-10-2-final'],
  'lista4-final': ['lista4', 'lista4-10', 'lista4-10-2', 'lista4-10-final', 'lista4-10-2-final', 'lista3', 'lista3-final', 'lista3-10', 'lista3-10-2', 'lista3-10-final', 'lista3-10-2-final', 'lista2', 'lista2-10', 'lista2-10-2', 'lista2-final', 'lista2-10-final', 'lista2-10-2-final'],
  'lista4-10-final': ['lista4', 'lista4-final', 'lista4-10', 'lista4-10-2', 'lista4-10-2-final', 'lista3', 'lista3-final', 'lista3-10', 'lista3-10-2', 'lista3-10-final', 'lista3-10-2-final', 'lista2', 'lista2-10', 'lista2-10-2', 'lista2-final', 'lista2-10-final', 'lista2-10-2-final'],
  'lista4-10-2-final': ['lista4', 'lista4-final', 'lista4-10', 'lista4-10-2', 'lista4-10-final', 'lista3', 'lista3-final', 'lista3-10', 'lista3-10-2', 'lista3-10-final', 'lista3-10-2-final', 'lista2', 'lista2-10', 'lista2-10-2', 'lista2-final', 'lista2-10-final', 'lista2-10-2-final'],
  'lista3': ['lista4', 'lista4-final', 'lista4-10', 'lista4-10-2', 'lista4-10-final', 'lista4-10-2-final', 'lista3-final', 'lista3-10', 'lista3-10-2', 'lista3-10-final', 'lista3-10-2-final', 'lista2', 'lista2-10', 'lista2-10-2', 'lista2-final', 'lista2-10-final', 'lista2-10-2-final'],
  'lista3-10': ['lista4', 'lista4-final', 'lista4-10', 'lista4-10-2', 'lista4-10-final', 'lista4-10-2-final', 'lista3','lista3-final', 'lista3-10-2', 'lista3-10-final', 'lista3-10-2-final', 'lista2', 'lista2-10', 'lista2-10-2', 'lista2-final', 'lista2-10-final', 'lista2-10-2-final'],
  'lista3-10-2': ['lista4', 'lista4-final', 'lista4-10', 'lista4-10-2', 'lista4-10-final', 'lista4-10-2-final', 'lista3','lista3-final', 'lista3-10', 'lista3-10-final', 'lista3-10-2-final', 'lista2', 'lista2-10', 'lista2-10-2', 'lista2-final', 'lista2-10-final', 'lista2-10-2-final'],
  'lista3-final' : ['lista4', 'lista4-final', 'lista4-10', 'lista4-10-2', 'lista4-10-final', 'lista4-10-2-final', 'lista3', 'lista3-10', 'lista3-10-2', 'lista3-10-final', 'lista3-10-2-final', 'lista2', 'lista2-10', 'lista2-10-2', 'lista2-final', 'lista2-10-final', 'lista2-10-2-final'],
  'lista3-10-final': ['lista4', 'lista4-final', 'lista4-10', 'lista4-10-2', 'lista4-10-final', 'lista4-10-2-final', 'lista3','lista3-final', 'lista3-10-2', 'lista3-10', 'lista3-10-2-final', 'lista2', 'lista2-10', 'lista2-10-2', 'lista2-final', 'lista2-10-final', 'lista2-10-2-final'],
  'lista3-10-2-final': ['lista4', 'lista4-final', 'lista4-10', 'lista4-10-2', 'lista4-10-final', 'lista4-10-2-final', 'lista3','lista3-final', 'lista3-10', 'lista3-10-2', 'lista3-10-final', 'lista2', 'lista2-10', 'lista2-10-2', 'lista2-final', 'lista2-10-final', 'lista2-10-2-final'],
  'lista2': ['lista4', 'lista4-final', 'lista4-10', 'lista4-10-2', 'lista4-10-final', 'lista4-10-2-final', 'lista3', 'lista3-final', 'lista3-10', 'lista3-10-2', 'lista3-10-final', 'lista3-10-2-final', 'lista2-10', 'lista2-10-2', 'lista2-final', 'lista2-10-final', 'lista2-10-2-final'],
  'lista2-10': ['lista4', 'lista4-final', 'lista4-10', 'lista4-10-2', 'lista4-10-final', 'lista4-10-2-final', 'lista3', 'lista3-final', 'lista3-10', 'lista3-10-2', 'lista3-10-final', 'lista3-10-2-final', 'lista2', 'lista2-10-2', 'lista2-final', 'lista2-10-final', 'lista2-10-2-final'],
  'lista2-10-2': ['lista4', 'lista4-final', 'lista4-10', 'lista4-10-2', 'lista4-10-final', 'lista4-10-2-final', 'lista3', 'lista3-final', 'lista3-10', 'lista3-10-2', 'lista3-10-final', 'lista3-10-2-final', 'lista2', 'lista2-10', 'lista2-final', 'lista2-10-final', 'lista2-10-2-final'],
  'lista2-final': ['lista4', 'lista4-final', 'lista4-10', 'lista4-10-2', 'lista4-10-final', 'lista4-10-2-final', 'lista3', 'lista3-final', 'lista3-10', 'lista3-10-2', 'lista3-10-final', 'lista3-10-2-final', 'lista2', 'lista2-10', 'lista2-10-2', 'lista2-10-final', 'lista2-10-2-final'],
  'lista2-10-final': ['lista4', 'lista4-final', 'lista4-10', 'lista4-10-2', 'lista4-10-final', 'lista4-10-2-final', 'lista3', 'lista3-final', 'lista3-10', 'lista3-10-2', 'lista3-10-final', 'lista3-10-2-final', 'lista2', 'lista2-10', 'lista2-10-2', 'lista2-final', 'lista2-10-2-final'],
  'lista2-10-2-final': ['lista4', 'lista4-final', 'lista4-10', 'lista4-10-2', 'lista4-10-final', 'lista4-10-2-final', 'lista3', 'lista3-final', 'lista3-10', 'lista3-10-2', 'lista3-10-final', 'lista2', 'lista2-10', 'lista2-10-2', 'lista2-final', 'lista2-10-final']
};


const validateUrl = (href: string, userPriceList: string) => {
  const url = new URL(href, window.location.origin);
  const pathParts = url.pathname.split('/');
  const priceListInUrl = pathParts[2];

  if (restrictedPriceLists[userPriceList]?.includes(priceListInUrl)) {
    window.location.href = '/no-access';
  }
};

const bolsasDePapel = (priceList: string, user: any) => {
  if (!user) return [];
  return [
    {
      name: 'Bolsas de Fondo Cuadrado con Manija',
      href: '#',
      submenu: [
        { name: 'Bolsas con Manija Kraft', href: `/listas/${priceList}/bolsas-con-manija-kraft` },
        { name: 'Bolsas con Manija Blancas', href: `/listas/${priceList}/bolsas-con-manija-blancas` },
        { name: 'Bolsas con Manija Color', href: `/listas/${priceList}/bolsas-con-manija-color` },
        { name: 'Bolsas con Manija Fantasía', href: `/listas/${priceList}/bolsas-con-manija-fantasia` },
      ],
    },
    {
      name: 'Bolsas de Fondo Cuadrado sin Manija',
      href: '#',
      submenu: [
        { name: 'Bolsas Fast Food "Cotillón" Estándar', href: `/listas/${priceList}/bolsas-fast-food-color` },
        { name: 'Bolsas Fast Food "Cotillón" Estándar x10', href: `/listas/${priceList}/bolsas-fast-food-color-x10` },
        { name: 'Bolsas Fast Food "Cotillón" Fantasía', href: `/listas/${priceList}/bolsas-fast-food-fantasia` },
        { name: 'Bolsas Fast Food Kraft', href: `/listas/${priceList}/bolsas-fast-food-kraft` },
      ],
    },
    {
      name: 'Bolsas de Fondo Americano',
      href: '#',
      submenu: [
        { name: 'Bolsas de Fondo Americano Kraft', href: `/listas/${priceList}/bolsas-fondo-americano-kraft` },
        { name: 'Bolsas de Fondo Americano Sulfito', href: `/listas/${priceList}/bolsas-fondo-americano-sulfito` },
      ],
    },
  ];
};

const bobinas = (priceList: string, user: any) => {
  if (!user) return [];
  return [
    { name: 'Bobinas de Papel Obra', href: `/listas/${priceList}/bobinas-obra` },
    { name: 'Bobinas de Papel Sulfito', href: `/listas/${priceList}/bobinas-sulfito` },
    { name: 'Bobinas de Papel Kraft', href: `/listas/${priceList}/bobinas-kraft` },
  ];
};

const calculateDiscountedPrice = (code: string, totalQuantity: number, price: number, priceList: string) => {
  let finalPrice = price;
  if (priceList === 'lista2' || priceList === 'lista3' || priceList === 'lista4') {
    finalPrice = price / 1.105;
  }
  if (priceList === 'lista2-10' || priceList === 'lista3-10' || priceList === 'lista4-10') {
    finalPrice = (price * 0.9) / 1.105;
  }
  if (priceList === 'lista2-10-2' || priceList === 'lista3-10-2' || priceList === 'lista4-10-2') {
    finalPrice = (price * 0.8802) / 1.105;
  }
  if (priceList === 'lista2-10-final' || priceList === 'lista3-10-final' || priceList === 'lista4-10-final') {
    finalPrice = (price * 0.9);
  }
  if (priceList === 'lista2-10-2-final' || priceList === 'lista3-10-2-final' || priceList === 'lista4-10-2-final') {
    finalPrice = (price * 0.8802);
  }
  if (code === 'Fb3' && totalQuantity >= 100) {
    return finalPrice * 0.9;
  }
  return finalPrice;
};

function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [showCartDetails, setShowCartDetails] = useState(false);
  const { cart, clearCart, removeItem, totalAmount } = useCart(); // Added totalAmount
  const [priceList, setPriceList] = useState<string | null>(null);
  const { user, logout, setUser } = useUser(); // Ensure setUser is defined
  const [showUserDetails, setShowUserDetails] = useState(false); // Add this line
  const [isPlacingOrder, setIsPlacingOrder] = useState(false); // Add this line
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false); // Nuevo estado para mostrar el buscador en mobile
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setShowUserDetails(false);
    setMobileMenuOpen(false);
    document.body.classList.remove('overlay-active');
    const loginSource = localStorage.getItem('loginSource');
    if (loginSource === 'seller') {
      window.location.href = '/loginSeller';
    } else {
      window.location.href = '/loginUser';
    }
  };

  useEffect(() => {
    const fetchPriceList = async () => {
      try {
        const response = await axios.get('/api/listUsers');
        const { priceList } = response.data as { priceList: string[] };
        setPriceList(priceList[0]); // Assuming you want the first priceList
        localStorage.setItem('priceList', JSON.stringify(priceList[0])); // Store price list in local storage
      } catch (error) {
        console.error('Error fetching price list:', error);
      }
    };

    const storedPriceList = localStorage.getItem('priceList');
    if (storedPriceList) {
      try {
        setPriceList(JSON.parse(storedPriceList));
      } catch (error) {
        console.error('Error parsing stored price list:', error);
        fetchPriceList();
      }
    } else {
      fetchPriceList();
    }

    const storedUser = localStorage.getItem('user');
    const assignedUser = localStorage.getItem('assignedUser');
    if (assignedUser) {
      try {
        const parsedUser = JSON.parse(assignedUser);
        if (typeof setUser === 'function') {
          setUser(parsedUser);
        } else {
          console.error('setUser is not a function');
        }
      } catch (error) {
        console.error('Error parsing assigned user:', error);
      }
    } else if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (typeof setUser === 'function') {
          setUser(parsedUser);
        } else {
          console.error('setUser is not a function');
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    } else {
      console.error('No user found in localStorage');
    }

    const validateCurrentUrl = () => {
      validateUrl(window.location.href, user.priceList);
    };

    validateCurrentUrl();
    window.addEventListener('popstate', validateCurrentUrl);

    return () => {
      window.removeEventListener('popstate', validateCurrentUrl);
    };
  }, [priceList, setUser]); // Add priceList and setUser as dependencies

  const handleSubmenuClick = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  const totalItems = Object.values(cart).reduce((acc, { quantity }) => acc + quantity, 0);

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true); // Add this line
    await placeOrder(cart, totalAmount, user, clearCart); // Pass user to placeOrder
    setIsPlacingOrder(false); // Add this line
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const totalQuantityByCode = (code: string) => {
    return Object.values(cart).reduce((acc, item) => item.code === code ? acc + item.quantity : acc, 0);
  };

  const totalAmountWithDiscount = Object.entries(cart).reduce((acc, [_, { quantity, description, price, code }]) => {
    const totalQuantity = totalQuantityByCode(code);
    const discountedPrice = calculateDiscountedPrice(code, totalQuantity, price, user.priceList);
    return acc + discountedPrice * quantity;
  }, 0);

  const toggleCartDetails = () => {
    const newShowCartDetails = !showCartDetails;
    setShowCartDetails(newShowCartDetails);
    if (newShowCartDetails) {
      setShowUserDetails(false);
      setOpenMenu(null);
      document.body.classList.add('overlay-active');
    } else {
      document.body.classList.remove('overlay-active');
    }
  };

  const handleClearCart = () => {
    clearCart();
    setShowCartDetails(false);
    document.body.classList.remove('overlay-active');
  };

  const toggleUserDetails = () => {
    const newShowUserDetails = !showUserDetails;
    setShowUserDetails(newShowUserDetails);
    if (newShowUserDetails) {
      setShowCartDetails(false);
      setOpenMenu(null);
      document.body.classList.add('overlay-active');
    } else {
      document.body.classList.remove('overlay-active');
    }
  };

  const handleMenuClick = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
    setShowCartDetails(false);
    setShowUserDetails(false);
    if (openMenu !== menu && window.innerWidth >= 1024) {
      document.body.classList.add('overlay-active');
    } else {
      document.body.classList.remove('overlay-active');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#A6CE39] z-50">
      <nav aria-label="Global" className="relative mx-auto flex items-center justify-between h-14 lg:h-16 p-2 lg:px-8 z-50">
        {/* Mobile search overlay */}
        {showMobileSearch && (
          <div className="fixed top-0 left-0 right-0 h-14 bg-[#A6CE39] z-[100] flex items-center px-2 w-full">
            <form onSubmit={handleSearch} className="flex items-center w-full">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-2 py-1 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1 bg-green-500 text-white rounded-r-lg hover:bg-green-600"
                aria-label="Buscar"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="ml-2 text-gray-700"
                onClick={() => setShowMobileSearch(false)}
                aria-label="Cerrar búsqueda"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </form>
          </div>
        )}
        <div className="flex lg:flex-1 justify-center lg:justify-start items-center h-full">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center h-full">
            <span className="sr-only">Your Company</span>
            <img alt="logo" src="/evacor-logo.png" className="h-6 w-auto lg:h-10" />
          </Link>
        </div>
        {/* Mobile search icon and input */}
        <div className="flex items-center justify-center flex-1 lg:hidden h-full">
          {!showMobileSearch ? (
            <>
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-gray-900 mr-4 flex items-center h-full"
                onClick={toggleCartDetails}
              >
                <i className="fas fa-shopping-cart cart-icon text-xl"></i>
                {totalItems > 0 && <span className="ml-2">{totalItems}</span>}
              </a>
              <button
                className="ml-2 text-gray-700 flex items-center h-full"
                onClick={() => setShowMobileSearch(true)}
                aria-label="Buscar"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
            </>
          ) : null}
        </div>
        {!showMobileSearch && (
          <div className="flex lg:hidden items-center h-full">
            <button
              type="button"
              onClick={handleMobileMenuToggle}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 h-full"
            >
              {mobileMenuOpen ? (
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              ) : (
                <Bars3Icon aria-hidden="true" className="h-6 w-6" />
              )}
            </button>
          </div>
        )}
        <div className="hidden lg:flex lg:gap-x-12 items-center h-full">
          {priceList && (
            <div className="relative">
              <button
                className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 bg-[#A6CE39]"
                onClick={() => handleMenuClick('bolsas')}
              >
                Bolsas de Papel
                <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none text-black" />
              </button>
              {openMenu === 'bolsas' && (
                <div className="absolute z-10 mt-3 w-screen max-w-sm overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                  <div className="p-4">
                    {priceList && bolsasDePapel(user.priceList, user).map((item) => (
                      <div key={item.name} className="mb-2">
                        <button
                          className="flex w-full items-center justify-between rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 bg-gray-200"
                          onClick={() => handleSubmenuClick(item.name)}
                        >
                          {item.name}
                          <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none text-black" />
                        </button>
                        {openSubmenu === item.name && (
                          <div className="mt-2 space-y-2 ml-4">
                            {item.submenu.map((subItem) => (
                              <a
                                key={subItem.name}
                                href={subItem.href}
                                className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                              >
                                {subItem.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="relative">
            <button
              className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 bg-[#A6CE39]"
              onClick={() => handleMenuClick('bobinas')}
            >
              Bobinas
              <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none text-black" />
            </button>
            {openMenu === 'bobinas' && (
              <div className="absolute z-10 mt-3 w-screen max-w-[15rem] overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  {bobinas(user.priceList, user).map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSearch} className="hidden lg:flex items-center ml-16 h-full">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-r-lg hover:bg-green-600"
          >
            Buscar
          </button>
        </form>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center h-full">
          <a
            href="#"
            className="text-sm font-semibold leading-6 text-gray-900 flex items-center h-full"
            onClick={toggleCartDetails}
          >
            <i className="fas fa-shopping-cart cart-icon text-2xl"></i>
            {totalItems > 0 && <span className="ml-2">{totalItems}</span>}
          </a>
          <button
            onClick={toggleUserDetails}
            className="ml-4 rounded-full text-gray-700 hover:text-gray-900 flex items-center h-full"
          >
            <UserIcon className="h-6 w-6" />
          </button>
        </div>
      </nav>
      {/* Dark overlay */}
      {(showCartDetails || (showUserDetails && !mobileMenuOpen) || (openMenu && window.innerWidth >= 1024)) && <div className="fixed inset-0 bg-black opacity-50 z-40 lg:block"></div>}
      {showUserDetails && user && (
        <div className="absolute right-4 mt-2 bg-white shadow-lg rounded-lg p-4 z-50 hidden lg:block w-auto">
          <div className="absolute top-0 left-0 right-0 h-14 bg-transparent z-50" onClick={toggleUserDetails}></div>
          <div className="max-w-md mx-auto mt-2">
            <p className="text-sm font-semibold">Usuario: {user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-500">Precio: {user.priceList}</p>
            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
      {showCartDetails && totalItems > 0 && (
        <div className="p-4 bg-white shadow-lg w-full z-50 relative">
          <div className="absolute top-0 left-0 right-0 h-14 bg-transparent z-50" onClick={toggleCartDetails}></div>
          <div className="max-w-md mx-auto mt-2"> {/* Adjusted margin-top */}
            <h2 className="text-lg font-semibold text-center">Carrito de Compras</h2>
            <ul className="mt-4 max-h-60 overflow-y-auto">
              {Object.entries(cart).map(([product, { quantity, description, price, code }]) => (
                <li key={product} className="flex justify-between py-2 px-4 border-b">
                  <div>
                    <span className="text-sm">{description}</span>
                    <p className="text-sm text-gray-500">
                      ${calculateDiscountedPrice(code, totalQuantityByCode(code), price, user.priceList).toFixed(0)} x{quantity} = ${Number(calculateDiscountedPrice(code, totalQuantityByCode(code), price, user.priceList) * quantity).toFixed(0)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => removeItem(product)}
                      className="ml-2 text-red-500 hover:text-red-700 text-2xl"
                    >
                      &times;
                    </button>
                  </div>
                </li>
              ))}
            </ul>
              
            <div className="mt-4 text-right">
              <span className="text-lg font-semibold">Total: ${totalAmountWithDiscount.toFixed(0)}</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between mt-4 px-4 space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto md:w-auto">
              <button
                onClick={handleClearCart}
                className="bg-red-500 text-white px-4 py-2 rounded-lg w-full sm:w-auto "
              >
                Vaciar Carrito
              </button>
              <button
                onClick={isPlacingOrder ? () => {} : handlePlaceOrder} // Disable button when placing order
                className={`bg-green-500 text-white px-4 py-2 rounded-lg w-full sm:w-auto ${isPlacingOrder ? 'opacity-50 cursor-not-allowed' : ''}`} // Add styles for disabled state
                disabled={isPlacingOrder} // Disable button when placing order
              >
                {isPlacingOrder ? (
                  <div className="flex items-center justify-center w-full">
                    Enviando Pedido
                    <svg className="animate-spin h-5 w-5 ml-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : (
                  'Realizar Pedido'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {showCartDetails && totalItems === 0 && (
        <div className="absolute right-4 mt-2 w-48 bg-white shadow-lg rounded-lg p-4 z-50">
          <div className="absolute top-0 left-0 right-0 h-14 bg-transparent z-50" onClick={toggleCartDetails}></div>
          <div className="max-w-md mx-auto mt-2">
            <h2 className="text-lg font-semibold text-center">Su carrito está vacío</h2>
          </div>
        </div>
      )}
      <Dialog open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 mt-10">
         
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <div className="-mx-3">
                  <button
                    className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 bg-[#A6CE39]"
                    onClick={() => handleMenuClick('bolsas')}
                  >
                    Bolsas de Papel
                    <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none group-data-[open]:rotate-180 text-black" />
                  </button>
                  {openMenu === 'bolsas' && (
                    <div className="mt-2 space-y-2">
                      {priceList && bolsasDePapel(user.priceList, user).map((item) => (
                        <div key={item.name} className="mb-2">
                          <button
                            className="flex w-full items-center justify-between rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 bg-gray-200"
                            onClick={() => handleSubmenuClick(item.name)}
                          >
                            {item.name}
                            <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none text-black" />
                          </button>
                          {openSubmenu === item.name && (
                            <div className="mt-2 space-y-2 ml-4">
                              {item.submenu.map((subItem) => (
                                <a
                                  key={subItem.name}
                                  href={subItem.href}
                                  className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                  {subItem.name}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="-mx-3">
                  <button
                    className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 bg-[#A6CE39]"
                    onClick={() => handleMenuClick('bobinas')}
                  >
                    Bobinas
                    <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none group-data-[open]:rotate-180 text-black" />
                  </button>
                  {openMenu === 'bobinas' && (
                    <div className="mt-2 space-y-2">
                      {bobinas(user.priceList, user).map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                {user && (
                  <div className="mt-4 bg-white shadow-lg rounded-lg p-4 lg:hidden">
                    <p className="text-sm font-semibold">Usuario: {user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-500">Precio: {user.priceList}</p>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
        
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}

export default withAuth(Example);