interface SubMenuTabProps {
  onInteract: (index: number) => void;
  isSelected: boolean;
  index: number;
  img: string;
  name: string;
  href: string;
}

const SubMenuTab = ({
  onInteract,
  isSelected,
  index,
  img,
  name,
  href,
}: SubMenuTabProps) => {
  return (
    <a
      href={href}
      draggable="false"
      className={`
    ${isSelected ? "bg-[#c0dafd]" : "hover:bg-[#F1EFEF]"}
    flex items-center font-google text-[#333333] h-[61px] px-[10%] gap-[20px] transition-all duration-200
  `}
      onClick={() => {
        onInteract(index);
      }}
    >
      <img src={img} className="w-[35px] h-auto" alt="" />
      <span className="text-[17px]">{name}</span>
    </a>
  );
};

export default SubMenuTab;
