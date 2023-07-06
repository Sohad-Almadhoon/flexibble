import { UserProfile } from "@/common.types";
import Profile from "@/components/Profile";
import { getUserProjects } from "@/lib/actions";

const UserProfile = async ({ params: { id } }: { params: { id: string } }) => {
  const result = (await getUserProjects(id, 100)) as { user: UserProfile };
  if (!result)
    return <p className="no-result-text">Failed to fetch user Info</p>;
    return <Profile user={result?.user} />;
};

export default UserProfile;
