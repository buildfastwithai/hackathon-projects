{login && 
    <div 
      className='h-screen w-screen flex items-center justify-center top-0 fixed bg-black bg-opacity-95' 
      onClick={() => setlogin(false)} // Close the modal when the background is clicked
    >
      <div 
        className='w-[30%] h-[50%] rounded-3xl flex relative justify-center items-center' 
        onClick={(e) => e.stopPropagation()} // Prevent background click when clicking inside modal content
      >
        <Tabs defaultValue="account" className="w-[40vw]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card className='h-[30vw]'>
              <CardHeader>
                <CardTitle className='text-[3vw]'>Account</CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you're done.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <input id="name" defaultValue="Pedro Duarte" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <input id="username" defaultValue="@peduarte" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card className='h-[30vw]'>
              <CardHeader>
                <CardTitle className='text-[3vw]'>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <input id="current" type="password" />
  