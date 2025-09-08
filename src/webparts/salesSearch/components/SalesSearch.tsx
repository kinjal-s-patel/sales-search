import * as React from "react";
import { HashRouter as Router } from "react-router-dom";
import AppRouter from "./Approuter"; // ensure exact filename case
import { ISalesSearchProps } from "./ISalesSearchProps";

const Home: React.FC<ISalesSearchProps> = (props) => {
  return (
    <Router>
      <AppRouter
        context={props.context}
        description={props.description}
        isDarkTheme={props.isDarkTheme}
        environmentMessage={props.environmentMessage}
        hasTeamsContext={props.hasTeamsContext}
        userDisplayName={props.userDisplayName}
      />
    </Router>
  );
};

export default Home;
