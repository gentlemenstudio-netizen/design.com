import { Logo } from "../(dashboard)/logo";



export const Sidebar = () => {
  return (
    <aside className="hidden lg:flex fixed flex-col w-[300px] left-0 shrink-0 h-full">
      <Logo />
    </aside>
  );
};
