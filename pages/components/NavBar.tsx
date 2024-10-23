// components/NavBar.tsx
import { useState } from 'react';
import Link from 'next/link';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';

const bolsasDePapel = [
  {
    name: 'Bolsas de Fondo Cuadrado con Manija',
    href: '#',
    submenu: [
      { name: 'Bolsas con Manija Kraft', href: '/bolsas-con-manija-kraft' },
      { name: 'Bolsas con Manija Blancas', href: '#' },
      { name: 'Bolsas con Manija Color', href: '#' },
      { name: 'Bolsas con Manija Fantasía', href: '#' },
    ],
  },
  {
    name: 'Bolsas de Fondo Cuadrado sin Manija',
    href: '#',
    submenu: [
      { name: 'Bolsas Fast Food "Cotillón" Estándar', href: '#' },
      { name: 'Bolsas Fast Food "Cotillón" Chica', href: '#' },
      { name: 'Bolsas Fast Food Kraft', href: '#' },
    ],
  },
  {
    name: 'Bolsas de Fondo Americano',
    href: '#',
    submenu: [
      { name: 'Bolsas de Fondo Americano Kraft', href: '#' },
      { name: 'Bolsas de Fondo Americano Sulfito', href: '#' },
    ],
  },
];

const bobinas = [
  { name: 'Bobinas de Papel Obra', href: '#' },
  { name: 'Bobinas de Papel Sulfito', href: '#' },
  { name: 'Bobinas de Papel Kraft', href: '#' },
];

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [showCartDetails, setShowCartDetails] = useState(false);
  const { cart, clearCart, removeItem, totalAmount } = useCart(); // Added totalAmount

  const handleSubmenuClick = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  const totalItems = Object.values(cart).reduce((acc, { quantity }) => acc + quantity, 0);

  const placeOrder = () => {
    alert('Pedido realizado con éxito!');
    clearCart();
  };

  return (
    <header className="bg-[#A6CE39]">
      <nav aria-label="Global" className="mx-auto flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1 justify-center lg:justify-start">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img alt="" src="evacor-logo.png" className="h-8 w-auto lg:h-16" />
          </Link>
        </div>
        <div className="flex items-center justify-center flex-1 lg:hidden">
          <a
            href="#"
            className="text-sm font-semibold leading-6 text-gray-900 mx-4"
            onClick={() => setShowCartDetails(!showCartDetails)}
          >
            <i className="fas fa-shopping-cart cart-icon text-2xl"></i>
            {totalItems > 0 && <span className="ml-2">{totalItems}</span>}
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
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
                  {bolsasDePapel.map((item) => (
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
                  {bobinas.map((item) => (
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
            onClick={() => setShowCartDetails(!showCartDetails)}
          >
            <i className="fas fa-shopping-cart cart-icon text-2xl"></i>
            {totalItems > 0 && <span className="ml-2">{totalItems}</span>}
          </a>
        </div>
      </nav>
      {showCartDetails && totalItems > 0 && (
        <div className="p-4 bg-white shadow-lg mt-4 w-full">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-semibold text-center">Carrito de Compras</h2>
            <ul className="mt-4">
              {Object.entries(cart).map(([product, { quantity, description, price }]) => (
                <li key={product} className="flex justify-between py-2 px-4 border-b">
                  <div>
                    <span className="text-sm">{description} - {product}</span>
                    <p className="text-sm text-gray-500">
                        ${price.toFixed(0)} x{quantity} = ${Number(price * quantity).toFixed(0)}
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
              <span className="text-lg font-semibold">Total: ${totalAmount.toFixed(0)}</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between mt-4 px-4 space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto md:w-auto">
              <button
                onClick={clearCart}
                className="bg-red-500 text-white px-4 py-2 rounded-lg w-full sm:w-auto "
              >
                Vaciar Carrito
              </button>
              <button
                onClick={placeOrder}
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
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img alt="" src="evacor-logo.png" className="h-8 w-auto" />
            </Link>
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => setShowCartDetails(!showCartDetails)}
            >
              <i className="fas fa-shopping-cart cart-icon text-2xl"></i>
              {totalItems > 0 && <span className="ml-2">{totalItems}</span>}
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
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
                      {bolsasDePapel.map((item) => (
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
                      {bobinas.map((item) => (
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
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  {/* ... */}
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}