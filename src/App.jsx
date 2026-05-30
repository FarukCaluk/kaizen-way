import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import MotivationVsDiscipline from "./components/MotivationVsDiscipline";
import ScrollOfWisdom from "./components/ScrollOfWisdom";
import NavDock from "./components/NavDock";

const VIEW_TRANSITION = {
  initial:    { opacity: 0, filter: "blur(10px)", scale: 0.99 },
  animate:    { opacity: 1, filter: "blur(0px)",  scale: 1    },
  exit:       { opacity: 0, filter: "blur(10px)", scale: 0.99 },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
};

export default function App() {
  const [view, setView] = useState("dashboard");

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {view === "dashboard" && (
          <motion.div key="dashboard" {...VIEW_TRANSITION}>
            <Dashboard />
          </motion.div>
        )}
        {view === "motivation" && (
          <motion.div key="motivation" {...VIEW_TRANSITION}>
            <MotivationVsDiscipline />
          </motion.div>
        )}
        {view === "wisdom" && (
          <motion.div key="wisdom" {...VIEW_TRANSITION}>
            <ScrollOfWisdom />
          </motion.div>
        )}
      </AnimatePresence>
      <NavDock current={view} onNavigate={setView} />
    </Layout>
  );
}
