import { Hooks } from "porto/wagmi";
import { useAccount, useConnectors, useDisconnect } from "wagmi";

export function Account() {
  const account = useAccount();
  const disconnect = useDisconnect();

  return (
    <div>
      <h2>Account</h2>

      <div>
        account: {account.address}
        <br />
        chainId: {account.chainId}
        <br />
        status: {account.status}
      </div>

      {account.status !== "disconnected" && (
        <button onClick={() => disconnect.disconnect()} type="button">
          Sign out
        </button>
      )}
    </div>
  );
}

export function SignIn() {
  const connect = Hooks.useConnect();
  const [connector] = useConnectors();

  return (
    <div>
      <h2>Connect</h2>
      <button
        onClick={() =>
          connect.mutate({
            connector,
            signInWithEthereum: {
              authUrl: "/api/siwe",
            },
          })
        }
        type="button"
      >
        Sign in
      </button>
      <div>{connect.error?.message}</div>
    </div>
  );
}
