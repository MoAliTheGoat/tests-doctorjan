import LoginModal from "@/src/components/LoginModal";
import {
    DataProvider,
    GlobalActionsProvider,
    GlobalContextMeta,
} from "@plasmicapp/host";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

type UserData = {
  userId: string;
  fullName: string;
  phoneNumber: string;
  roles: any;
  createdOn: any;
  profileImageGuid: any;
};

type AuthProps = React.PropsWithChildren<{}>;

export const Authentication = ({ children }: AuthProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginCause, setLoginCause] = useState("");

  const setToken = (token: string) => {
    const code = token;
    const decoded = jwt.decode(code) as JwtPayload | null;

    const currentDate = new Date();
    // @ts-ignore
    const targetDate = new Date(decoded?.exp * 1000);
    const timeDifference = targetDate.getTime() - currentDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    Cookies.set("jwt", code, { expires: daysDifference });

    if (decoded)
      setUserData({
        userId: decoded["UserId"] as string,
        fullName: decoded["FullName"] as string,
        phoneNumber: decoded["PhoneNumber"] as string,
        roles: decoded["Roles"] ?? [],
        createdOn: decoded["CreatedOn"] ?? null,
        profileImageGuid: decoded["ProfileImageGuid"] ?? null,
      });
  };

  const handleLogOut = () => {
    setIsLoggedIn(false);
    Cookies.remove("jwt");
    toast.success("با موفقیت خارج شدید", {
      position: "top-center",
    });
    const currentUrl = encodeURIComponent(window.location.href);
    location.assign(decodeURIComponent(currentUrl));
  };

  const checkUserLogin = () => {
    const jwtToken = Cookies.get("jwt");

    if (jwtToken) {
      const decodedToken = jwt.decode(jwtToken) as JwtPayload | null;

      if (decodedToken) {
        setIsLoggedIn(true);
        setUserData({
          userId: decodedToken["UserId"] as string,
          fullName: decodedToken["FullName"] as string,
          phoneNumber: decodedToken["PhoneNumber"] as string,
          roles: decodedToken["Roles"] ?? [],
          createdOn: decodedToken["CreatedOn"] ?? null,
          profileImageGuid: decodedToken["ProfileImageGuid"] ?? null,
        });
      }
    }
  };

  const openLoginModal = useCallback((cause: string) => {
    setLoginCause(cause);
    (document.getElementById("loginFragmentModal") as HTMLDialogElement)?.showModal();
  }, []);

  const closeLoginModal = useCallback(() => {
    (document.getElementById("loginFragmentModal") as HTMLDialogElement)?.close();
  }, []);

  useEffect(() => {
    checkUserLogin();
  }, []);

  const actions = useMemo(
    () => ({
      logout: () => handleLogOut(),
      openLoginModal: (cause: string) => openLoginModal(cause),
      closeLoginModal,
    }),
    []
  );

  return (
    <GlobalActionsProvider contextName="Authentication" actions={actions}>
      <DataProvider name="auth" data={{ userData, isLoggedIn }}>
        {children}
        {/*<Toaster />*/}
        <LoginModal loginCause={loginCause} />
      </DataProvider>
    </GlobalActionsProvider>
  );
};

export const authMeta: GlobalContextMeta<AuthProps> = {
  name: "Authentication",
  displayName: "Fragment/Authentication",
  importPath: "./../../../src/fragment/Authentication",
  providesData: true,
  props: {},
  globalActions: {
    logout: {
      parameters: [],
    },
    openLoginModal: {
      parameters: [
        { name: "cause", type: "string", displayName: "Login cause" },
      ],
    },
    closeLoginModal: {
      parameters: [],
    },
  },
};
