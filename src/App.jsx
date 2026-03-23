import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "./components/Layout";
import Seed from "./components/Seed";
import Roots from "./components/Roots";
import Trunk from "./components/Trunk";
import Canopy from "./components/Canopy";

function App() {
  const [phase, setPhase] = useState(1);
  const handleSeedComplete = () => {
    setPhase(2);
  };

  const handleRootsContinue = () => {
    setPhase(3);
  };

  const handleTrunkComplete = () => {
    setPhase(4);
  };

  const progressValue =
    phase === 1 ? 0 : phase === 2 ? 25 : phase === 3 ? 50 : 100;

  return (
    <Layout progress={progressValue}>
      <div className="overflow-x-hidden">
        <AnimatePresence mode="wait">
          {phase === 1 && (
            <motion.div
              key="seed"
              initial={{ opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Seed onComplete={handleSeedComplete} />
            </motion.div>
          )}

          {phase === 2 && (
            <motion.div
              key="roots"
              initial={{ opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Roots onContinue={handleRootsContinue} />
            </motion.div>
          )}

          {phase >= 3 && phase < 4 && (
            <motion.div
              key="trunk"
              initial={{ opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Trunk onComplete={handleTrunkComplete} />
            </motion.div>
          )}

          {phase === 4 && (
            <motion.div
              key="canopy"
              initial={{ opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Canopy />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}

export default App;
