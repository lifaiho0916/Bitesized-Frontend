import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { accountAction } from "../../../redux/actions/socialAccountActions";
import IgBtn from "../../../assets/svg/ig.svg";
import api from "@fortawesome/fontawesome";
import axios from "axios";

export const InstagramLogin = (props: any) => {
	const { account, contexts } = props;
	const [searchParams] = useSearchParams();
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const userState = useSelector((state: any) => state.auth);
	const { user } = userState;

	const clickHandler = () => {
		//alert("We will launch it soon");
		const clientId = process.env.REACT_APP_INSTAGRAM_APP_ID;
		const scope = process.env.REACT_APP_INSTAGRAM_SCOPE;
		const responseType = "code";
		const redirectUri = `https://${window.location.host}${window.location.pathname}`;
		window.location.href = `https://api.instagram.com/oauth/authorize/?app_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;
	};

	const removeHandler = () => {
		// const { _id } = accounts.find((acc: any) => acc.name === "instagram");
		// dispatch(accountAction.removeAccount(_id));
		if (hasInstagram)
			dispatch(accountAction.removeAccount(account._id, "instagram"));
	};

	const hasInstagram: any = useMemo(() => {
		if (account && account.social && account.social.instagram) return true;
		else return false;
	}, [account]);

	const onSuccess = useCallback(
		async (code) => {
			try {
				const redirect_uri = `https://${window.location.host}${window.location.pathname}`;
				const meta = {
					code,
					redirect_uri,
					grant_type: "authorization_code",
				};

				const data = {
					id: code,
					name: "instagram",
					metadata: JSON.stringify(meta),
				};

				dispatch(accountAction.addInstagramAccount(data));
			} catch (error) {
				alert("Something went wrong");
				console.log(error);
			}

			// dispatch(
			//   accountAction.addAccount(data, (result: Boolean) => {
			//     if (result) {
			//       // dispatch(accountAction.getAccounts(user.id));
			//       setTimeout(() => {
			//         navigate(pathname);
			//       }, 2000);
			//     }
			//   })
			// );
		},
		[dispatch, pathname, navigate]
	);

	// const openInstagramProfile = () => {
	// 	const data = accounts.find((acc: any) => acc.name === "instagram");
	// 	const { username } = JSON.parse(data.metadata);
	// 	window.open(`https://www.instagram.com/${username}`);
	// };

	const onFailure = useCallback(() => {
		if (searchParams.get("error")) {
			const data = {
				error: searchParams.get("error"),
				error_reason: searchParams.get("error_reason"),
				error_description: searchParams.get("error_description"),
			};
			console.log(data);
		}
	}, [searchParams]);

	useEffect(() => {
		const code = searchParams.get("code");
		if (code) onSuccess(code);
		else onFailure();
	}, [onSuccess, onFailure, searchParams, dispatch, user]);

	return (
		<div
			className={hasInstagram ? "remove-btn" : "connect-btn"}
			onClick={hasInstagram ? removeHandler : clickHandler}
		>
			{hasInstagram ? (
				<span>Remove</span>
			) : (
				<span>{contexts.GENERAL.CONNECT}</span>
			)}
		</div>
	);
};

export default InstagramLogin;
