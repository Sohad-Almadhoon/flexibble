"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { categoryFilters } from "@/constants";

const Categories = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const filter = searchParams.get("category");
  const handleTags = (category: string) => {
    router.push(`${pathName}?category=${category}`);
  };
  return (
    <div className="flexBetween w-full gap-5 flex-warp">
      <ul className="flex gap-2 overflow-auto">
        {categoryFilters.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => handleTags(category)}
            className={`${
              category === filter
                ? "bg-light-white-300 font-medium"
                : "font-normal"
            } px-4 py-3 rounded-lg capitalize whitespace-nowrap`}>
            {category}
          </button>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
