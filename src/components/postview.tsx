import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
	const { post, author } = props;
	return (
		<div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
			<Image
				src={author.profileImageUrl}
				alt="Profile Image"
				className="w-14 h-14 rounded-full"
				width={56}
				height={56}
			/>
			<div className="flex flex-col">
				<div className="flex text-slate-300 font-bold gap-1">
					<Link href={`/@${author.username || author.firstName || 'User'}`}>
						<span>{`@${author.username || author.firstName || 'User'}`}</span>
					</Link>
					<Link href={`/post/${post.id}`}>
						<span className="font-thin">
							{`· ${dayjs(post.createdAt).fromNow()}`}
						</span>
					</Link>
				</div>
				<span className="text-2xl">{post.content}</span>
			</div>
		</div>
	);
}
