import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import React, { SyntheticEvent, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import "./SearchBar.css";

function SearchBar(props: any) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [userValue, setUserValue] = useState<string>("");

  const changeInput = (event: SyntheticEvent) => {
    const value = (event.target as HTMLInputElement).value;
    setUserValue(value);
  };

  const closeSearchBar = () => {
    setTimeout(() => {
      setIsVisible(false);
      setUserValue("");
    }, 100);
  };

  const handleSearchClick = async (e: any) => {
    if (!isVisible) {
      setIsVisible(true);
      return;
    }
    if (userValue) {
      await props.onSearch(userValue);
    }
  };

  const searchBtnStyle = {
    boxShadow: "rgba(241, 240, 240, 0.45) 0px 2px 10px",
    color: "blue",
    width: isVisible ? "2.8rem" : "3.5rem",
    height: isVisible ? "2.8rem" : "3.5rem",
    backgroundColor: "rgb(232, 232, 250)",
    transition: "width 0.3s, height 0.3s",
    ":hover": {
      boxShadow: "rgba(241, 240, 240, 0.45) 0px 4px 15px",
      backgroundColor: "rgb(220, 232, 250)",
      width: isVisible ? "2.9rem" : "3.6rem",
      height: isVisible ? "2.9rem" : "3.6rem",
      transition: "width 0.3s, height 0.3s",
    },
  };

  return (
    <Paper
      component="form"
      sx={{ borderRadius: "30px" }}
      className={isVisible ? "search-bar-form-open" : "search-bar-form-close"}
      onSubmit={(e) => e.preventDefault()}
    >
      {isVisible && (
        <ClearIcon className="search-delete-btn" onClick={closeSearchBar} />
      )}
      <InputBase
        onChange={changeInput}
        onBlur={closeSearchBar}
        value={userValue}
        sx={{ ml: 3, flex: 1, fontSize: 20 }}
        placeholder="find your vacation..."
      />
      <IconButton sx={searchBtnStyle} onClick={handleSearchClick}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

export default SearchBar;
