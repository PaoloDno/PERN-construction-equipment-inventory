
const FooterComponent = () => {
  return (
    <div className="flex flex-row min-w-screen bg-primary
      min-h-36 justify-between items-center
    ">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-2 px-4">
        <div>
        <p>Site Introduction</p>
        </div>
        <div>
        <p>What this is for learning SQL</p>
        </div>
        <div>
          <h3>Nav for with token</h3>
        <p>To Project</p>
        <p>To Equipment</p>
        </div>
        <div>
          <h3>
            footer
          </h3>
          <p>link to my portfolio</p>
          <p>link to my github</p>
          <p>my gmail.com</p>
        </div>
      </div>
    </div>
  )
};

export default FooterComponent;
