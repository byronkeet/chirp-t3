import { useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import Image from "next/image";

import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";


const CreatePostWizard = () => {
	const [input, setinput] = useState("");
	const { user } = useUser();

	if (!user) return null;

	const ctx = api.useContext();

	const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
		onSuccess: () => {
			setinput("");
			void ctx.posts.getAll.invalidate();
		},
		onError: (e) => {
			const errorMessage = e.data?.zodError?.fieldErrors.content;
			if (errorMessage && errorMessage[0]) {
				toast.error(errorMessage[0]);
			} else {
				toast.error("Failed to post! Please try again later.");
			}
		},
	});

	return (
		<div className="flex w-full gap-3">
			<Image
				src={user.profileImageUrl}
				alt="Profile Image"
				className="w-14 h-14 rounded-full"
				width={56}
				height={56}
			/>
			<input
				placeholder="Type some emojis!"
				className="grow bg-transparent outline-none"
				type="text"
				value={input}
				onChange={(e) => setinput(e.target.value)}
				disabled={isPosting}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						if (input !== "") {
							mutate({ content: input });
						}
					}
				}}
			/>
			{input !== "" && !isPosting &&
				<button onClick={() => mutate({ content: input })}>Post</button>
			}
			{isPosting && <div className="flex flex-center items-center"><LoadingSpinner size={20} /></div>}
		</div>
	);
};

const Feed = () => {
	const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

	if (postsLoading) return <LoadingPage />;

	if (!data) return <div>Something went wrong...</div>;

	return (
		<div className="flex flex-col">
			{data?.map((fullPost) => (
				<PostView {...fullPost} key={fullPost.post.id}/>
			))}
		</div>
	);
}

export default function Home() {
	const { isLoaded: userLoaded, isSignedIn }= useUser();

	// Start fetching asap
	api.posts.getAll.useQuery();

	if (!userLoaded) return <div />;

	return (
		<PageLayout>
			<div className="flex border-b border-slate-400 p-4">
				{!isSignedIn && (
					<div className="flex justify-center">
						<SignInButton />
					</div>
				)}
				{isSignedIn && <CreatePostWizard />}
			</div>
			<Feed />
		</PageLayout>
	);
}
