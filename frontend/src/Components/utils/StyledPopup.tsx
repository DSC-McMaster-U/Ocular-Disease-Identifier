import Popup from "reactjs-popup";
import styled from "styled-components";

const StyledPopup = styled(Popup)`
  &-content {
    margin: auto;
    background: rgb(255, 255, 255);
    min-width: fit;
    min-height: fit;
    max-width: 50%;
    padding: 5px;
    border: 2px;
    border-radius: 10px;
    -webkit-animation: anvil 0.3s cubic-bezier(0.38, 0.1, 0.36, 0.9) forwards;
  }
  &-arrow {
    color: rgb(255, 255, 255);
  }

  [role="tooltip"].&-content {
    width: 200px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 0px 3px;
  }

  &-overlay {
    backdrop-filter: blur(10px);
    background: rgba(0, 0, 0, 0.5);
  }
  [data-popup="tooltip"].&-overlay {
    background: transparent;
  }

  @keyframes anvil {
    0% {
      transform: scale(1) translateY(0px);
      opacity: 0;
      box-shadow: 0 0 0 rgba(241, 241, 241, 0);
    }
    1% {
      transform: scale(0.96) translateY(10px);
      opacity: 0;
      box-shadow: 0 0 0 rgba(241, 241, 241, 0);
    }
    100% {
      transform: scale(1) translateY(0px);
      opacity: 1;
      box-shadow: 0 0 500px rgba(241, 241, 241, 0);
    }
  }
`;

export default StyledPopup;
