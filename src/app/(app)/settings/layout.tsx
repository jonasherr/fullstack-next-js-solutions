import { cn } from "@/lib/utils";
import {
  BellIcon,
  BoxIcon,
  CreditCardIcon,
  FingerprintIcon,
  UserCircleIcon,
  UsersIcon,
} from "lucide-react";

const secondaryNavigation = [
  { name: "General", href: "#", icon: UserCircleIcon, current: true },
  { name: "Security", href: "#", icon: FingerprintIcon, current: false },
  { name: "Notifications", href: "#", icon: BellIcon, current: false },
  { name: "Plan", href: "#", icon: BoxIcon, current: false },
  { name: "Billing", href: "#", icon: CreditCardIcon, current: false },
  { name: "Team members", href: "#", icon: UsersIcon, current: false },
];

const isLandlord = () => {
  const zeroOrOne = Math.round(Math.random());
  return zeroOrOne === 0;
};

export default function Layout({
  children,
  renter,
  landlord,
}: {
  children: React.ReactNode;
  renter: React.ReactNode;
  landlord: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl lg:flex lg:gap-x-16 lg:px-8">
      <aside className="flex overflow-x-auto border-b border-gray-900/5 py-8 lg:block lg:w-64 lg:flex-none lg:border-0">
        <nav className="flex-none px-4 sm:px-6 lg:px-0">
          <ul
            role="list"
            className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col"
          >
            {secondaryNavigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={cn(
                    item.current
                      ? "bg-gray-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                    "group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm/6 font-semibold",
                  )}
                >
                  <item.icon
                    aria-hidden="true"
                    className={cn(
                      item.current
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-indigo-600",
                      "h-6 w-6 shrink-0",
                    )}
                  />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {isLandlord() ? landlord : renter}
      {children}
    </section>
  );
}
