import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@radix-ui/react-label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LoginSignupModal = ({
  setIdentifier,
  setPasswordLogin,
  handleLogin,
  setlogin,
  handleSignup,
  setUsername,
  setEmail,
  setPasswordSignup,
}) => {

  
  return (
    <>
      
      <div
        onClick={() => setlogin(false)}
        className="h-screen w-screen flex items-center justify-center top-0 fixed bg-[#000000] bg-opacity-60 backdrop-blur-xl transition-all duration-500 animate-fadeIn "
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-[30%] h-[50%] rounded-3xl flex relative justify-center items-center"
        >
          <Tabs defaultValue="account" className="w-[40vw]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Login</TabsTrigger>
              <TabsTrigger value="password">Signup</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card className="h-[33vw]">
                <CardHeader>
                  <CardTitle className="text-[3vw]">Login</CardTitle>
                  <CardDescription>
                    Enter your MindWars AI credentials to login.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-2">
                    <div className="space-y-1 flex flex-col justify-between ">
                      <Label htmlFor="username" className="font-medium">
                        Username or Email
                      </Label>
                      <input
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        id="username"
                        placeholder="Enter your username (or email)"
                        className="placeholder-opacity-50 px-[1vw] py-[0.9vw] border-2 border-black rounded-lg"
                      />
                    </div>
                    <div className="space-y-1 flex flex-col justify-between">
                      <Label htmlFor="password" className="font-medium">
                        Password
                      </Label>
                      <input
                        onChange={(e) => setPasswordLogin(e.target.value)}
                        required
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="placeholder-opacity-50 px-[1vw] py-[0.9vw] border-2 border-black rounded-lg"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Login</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card className="h-[33vw]">
                <CardHeader>
                  <CardTitle className="text-[3vw]">Sign Up</CardTitle>
                  <CardDescription>
                    Let's create a new account to begin.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                  <CardContent className="space-y-2">
                    <div className="space-y-1 flex flex-col justify-between ">
                      <Label htmlFor="username" className="font-medium">
                        Username
                      </Label>
                      <input
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        id="username"
                        placeholder="Enter username (min 4 letter)"
                        className="placeholder-opacity-50 px-[1vw] py-[0.9vw] border-2 border-black rounded-lg"
                      />
                    </div>
                    <div className="space-y-1 flex flex-col justify-between ">
                      <Label htmlFor="email" className="font-medium">
                        Email
                      </Label>
                      <input
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        id="email"
                        placeholder="Enter your email address"
                        className="placeholder-opacity-50 px-[1vw] py-[0.9vw] border-2 border-black rounded-lg"
                      />
                    </div>
                    <div className="space-y-1 flex flex-col justify-between">
                      <Label htmlFor="password" className="font-medium">
                        Password
                      </Label>
                      <input
                        onChange={(e) => setPasswordSignup(e.target.value)}
                        required
                        id="password"
                        type="password"
                        placeholder="Enter the Password"
                        className="placeholder-opacity-50 px-[1vw] py-[0.9vw] border-2 border-black rounded-lg"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Sign Up</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleUp {
          from {
            transform: scale(0.9);
            opacity: 0.6;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out forwards;
        }

        .animate-scaleUp {
          animation: scaleUp 0.3s ease-in-out forwards;
        }
      `}</style>
    </>
  );
};

export default LoginSignupModal;
