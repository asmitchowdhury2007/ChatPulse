function Avatar({ fullname, profilePic, size = 48 }) {
  const initials = fullname
    ?.split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="flex items-center justify-center overflow-hidden font-semibold text-white rounded-full bg-cyan-600"
      style={{ width: size, height: size }}
    >
      {profilePic ? (
        <img
          src={profilePic}
          alt={fullname}
          className="object-cover w-full h-full"
        />
      ) : (
        initials
      )}
    </div>
  );
}

export default Avatar;