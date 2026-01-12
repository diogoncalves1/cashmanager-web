export function UserCircle({ userName }: { userName: string }) {
  return (
    <div
      className="
        relative group
        size-6
        rounded-full bg-blue-100
        flex items-center justify-center
        text-xs font-medium text-blue-700
        cursor-default
        transition-all duration-200
        hover:z-20 hover:scale-110
      "
    >
      {userName.charAt(0)}

      <div
        className="
          pointer-events-none
          absolute bottom-full left-1/2
          z-30
          mb-2
          w-max
          -translate-x-1/2
          rounded-md bg-gray-900
          px-2 py-1
          text-xs text-white
          opacity-0 scale-95
          transition-all duration-200 ease-out
          group-hover:opacity-100 group-hover:scale-100
        "
      >
        {userName}
        <div className="absolute left-1/2 top-full h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-gray-900" />
      </div>
    </div>
  );
}
