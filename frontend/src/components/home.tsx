import * as React from "react";
import "./../css/home.css";

interface HomeProps {}

const Home: React.FunctionComponent<HomeProps> = () => {
  return (
    <div id="Home">
      <form>
        <div className="filewrapper">
          <label htmlFor="fileUp">Choose a file to upload:</label>
          <input
            type="file"
            id="fileUp"
            name="fileUp"
            accept=".txt,.doc,.docx,.pdf"
            multiple={true}
          />
        </div>
        <div className="submitwrapper">
          <input type="submit" value="Upload" />
        </div>
      </form>
    </div>
  );
};

export default Home;
