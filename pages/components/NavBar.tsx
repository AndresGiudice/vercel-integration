// components/NavBar.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, ChevronDownIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline'; // Add UserIcon import
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext'; // Assuming you have a UserContext
import axios from 'axios';
import withAuth from '../../components/withAuth';

const placeOrder = async (cart: any, totalAmount: number, clearCart: () => void) => {
  try {
    await axios.post('/api/sendOrderEmail', { cart, totalAmount });
    alert('Pedido realizado con éxito!');
    clearCart();
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    alert('Hubo un error al realizar el pedido. Por favor, inténtalo de nuevo.');
  }
};

const bolsasDePapel = (priceList: string) => [
  {
    name: 'Bolsas de Fondo Cuadrado con Manija',
    href: '#',
    submenu: [
      { name: 'Bolsas con Manija Kraft', href: `/listas/${priceList}/bolsas-con-manija-kraft` },
      { name: 'Bolsas con Manija Blancas', href: `/listas/${priceList}/bolsas-con-manija-blancas` },
      { name: 'Bolsas con Manija Color', href: `/listas/${priceList}/bolsas-con-manija-color` },
      { name: 'Bolsas con Manija Fantasía', href: '#' },
    ],
  },
  {
    name: 'Bolsas de Fondo Cuadrado sin Manija',
    href: '#',
    submenu: [
      { name: 'Bolsas Fast Food "Cotillón" Estándar', href: `/listas/${priceList}/bolsas-fast-food-color` },
      { name: 'Bolsas Fast Food "Cotillón" Estándar x10', href: `/listas/${priceList}/bolsas-fast-food-color-x10` },
      { name: 'Bolsas Fast Food "Cotillón" Fantasía', href: `/listas/${priceList}/bolsas-fast-food-fantasia` },
      { name: 'Bolsas Fast Food "Cotillón" Chica', href: '#' },
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

const bobinas = (priceList: string) => [
  { name: 'Bobinas de Papel Obra', href: `/listas/${priceList}/bobinas-obra` },
  { name: 'Bobinas de Papel Sulfito', href: `/listas/${priceList}/bobinas-sulfito` },
  { name: 'Bobinas de Papel Kraft', href: `/listas/${priceList}/bobinas-kraft` },
];

const calculateDiscountedPrice = (code: string, totalQuantity: number, price: number) => {
  if (code === 'Fb3' && totalQuantity >= 100) {
    return price * 0.9;
  }
  return price;
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

  const handleLogout = () => {
    logout();
    window.location.href = '/loginUser'; // Redirect to loginUser.tsx
  };

  useEffect(() => {
    const fetchPriceList = async () => {
      try {
        const response = await axios.get('/api/listUsers');
        const { priceList } = response.data as { priceList: string[] };
        setPriceList(priceList[0]); // Assuming you want the first priceList
      } catch (error) {
        console.error('Error fetching price list:', error);
      }
    };

    fetchPriceList();

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
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
  }, []);

  const handleSubmenuClick = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  const totalItems = Object.values(cart).reduce((acc, { quantity }) => acc + quantity, 0);

  const handlePlaceOrder = () => {
    placeOrder(cart, totalAmount, clearCart);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const totalQuantityByCode = (code: string) => {
    return Object.values(cart).reduce((acc, item) => item.code === code ? acc + item.quantity : acc, 0);
  };

  const totalAmountWithDiscount = Object.entries(cart).reduce((acc, [_, { quantity, description, price, code }]) => {
    const totalQuantity = totalQuantityByCode(code);
    const discountedPrice = calculateDiscountedPrice(code, totalQuantity, price);
    return acc + discountedPrice * quantity;
  }, 0);

  const toggleCartDetails = () => {
    setShowCartDetails(!showCartDetails);
  };

  const toggleUserDetails = () => {
    setShowUserDetails(!showUserDetails);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#A6CE39] z-50">
      <nav aria-label="Global" className="mx-auto flex items-center justify-between h-14 lg:h-16 p-2 lg:px-8">
        <div className="flex lg:flex-1 justify-center lg:justify-start">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img alt="logo" src="/evacor-logo.png" className="h-6 w-auto lg:h-10" />
          </Link>
        </div>
        <div className="flex  items-center justify-center flex-1 lg:hidden">
          <a
            href="#"
            className="text-sm font-semibold leading-6 text-gray-900 mr-10 "
            onClick={toggleCartDetails}
          >
            <i className="fas fa-shopping-cart cart-icon text-xl"></i>
            {totalItems > 0 && <span className="ml-2">{totalItems}</span>}
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={handleMobileMenuToggle}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            {mobileMenuOpen ? (
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            ) : (
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            )}
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {priceList && (
            <div className="relative">
              <button
                className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 bg-[#A6CE39]"
                onClick={() => setOpenMenu(openMenu === 'bolsas' ? null : 'bolsas')}
              >
                Bolsas de Papel
                <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none text-black" />
              </button>
              {openMenu === 'bolsas' && (
                <div className="absolute z-10 mt-3 w-screen max-w-sm overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                  <div className="p-4">
                    {priceList && bolsasDePapel(user.priceList).map((item) => (
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
              onClick={() => setOpenMenu(openMenu === 'bobinas' ? null : 'bobinas')}
            >
              Bobinas
              <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none text-black" />
            </button>
            {openMenu === 'bobinas' && (
              <div className="absolute z-10 mt-3 w-screen max-w-[15rem] overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  {bobinas(user.priceList).map((item) => (
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
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a
            href="#"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={toggleCartDetails}
          >
            <i className="fas fa-shopping-cart cart-icon text-2xl"></i>
            {totalItems > 0 && <span className="ml-2">{totalItems}</span>}
          </a>
          <button
            onClick={toggleUserDetails}
            className="ml-4 rounded-full text-gray-700 hover:text-gray-900"
          >
            <UserIcon className="h-6 w-6" />
          </button>
        </div>
      </nav>
      {showUserDetails && user && ( // Check if user exists
        <div className="absolute right-4 mt-2 w-48 bg-white shadow-lg rounded-lg p-4">
          <p className="text-sm font-semibold">Usuario: {user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-500">Precio: {user.priceList}</p> {/* Display priceList */}
          <button
            onClick={handleLogout} // Use handleLogout instead of logout
            className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
      {showCartDetails && totalItems > 0 && (
        <div className="p-4 bg-white shadow-lg mt-4 w-full">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-semibold text-center">Carrito de Compras</h2>
            <ul className="mt-4 max-h-60 overflow-y-auto">
              {Object.entries(cart).map(([product, { quantity, description, price, code }]) => (
                <li key={product} className="flex justify-between py-2 px-4 border-b">
                  <div>
                    <span className="text-sm">{description}</span>
                    <p className="text-sm text-gray-500">
                      ${calculateDiscountedPrice(code, totalQuantityByCode(code), price).toFixed(0)} x{quantity} = ${Number(calculateDiscountedPrice(code, totalQuantityByCode(code), price) * quantity).toFixed(0)}
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
                onClick={clearCart}
                className="bg-red-500 text-white px-4 py-2 rounded-lg w-full sm:w-auto "
              >
                Vaciar Carrito
              </button>
              <button
                onClick={handlePlaceOrder}
                className="bg-green-500 text-white px-4 py-2 rounded-lg w-full sm:w-auto"

              >
                Realizar Pedido
              </button>
            </div>
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
                    onClick={() => setOpenMenu(openMenu === 'bolsas' ? null : 'bolsas')}
                  >
                    Bolsas de Papel
                    <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none group-data-[open]:rotate-180 text-black" />
                  </button>
                  {openMenu === 'bolsas' && (
                    <div className="mt-2 space-y-2">
                      {priceList && bolsasDePapel(user.priceList).map((item) => (
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
                    onClick={() => setOpenMenu(openMenu === 'bobinas' ? null : 'bobinas')}
                  >
                    Bobinas
                    <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none group-data-[open]:rotate-180 text-black" />
                  </button>
                  {openMenu === 'bobinas' && (
                    <div className="mt-2 space-y-2">
                      {bobinas(user.priceList).map((item) => (
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
              </div>
        
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}

export default withAuth(Example);