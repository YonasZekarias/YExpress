const UserInfo = ({
  avatar,
  username,
  email,
}: {
  avatar: string;
  username: string;
  email: string;
}) => {
  return (
    <div className="flex items-center p-3 mb-8 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
      <img src={avatar} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
      <div className="overflow-hidden">
        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
          {username}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {email}
        </p>
      </div>
    </div>
  );
};

export default UserInfo;
