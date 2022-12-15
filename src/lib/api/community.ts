import { PaginationData, createAPIFunction, Schemas } from "./connection";



interface Community {
  teamId: string;
    createdAt: string;
    lastPostedAt: string;
    likeCount: number;
    replyCount: number;
    title: string;
    topicId: number;
    views: number;

  }

interface GetCommunityOutput {
    data: Community[];
    paginationData: PaginationData;
  }


const getCommunity = createAPIFunction<void, GetCommunityOutput>("GET", "/api/community/topics");

// const removeTeam = createAPIFunction<{communityId: string }>(
//     "DELETE",
//     "/api/community"
//   );

const communityAPI = {
    getCommunity


  };
  export { communityAPI };
export type { Community };