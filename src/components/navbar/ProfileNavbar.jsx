import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AiOutlineCaretDown } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { Button } from "../general";
import { useAuth } from "../../context/AuthContext";
import { Avatar } from "@nachogonzalezv99/ui-library";

function ProfileNavbar() {
  const { user, logout } = useAuth();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Avatar name={user.name}/>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={10}
          align="end"
          style={{
            backgroundColor: "white",
            padding: "1.2rem",
            border: "1px solid #C3C3C3",
            borderRadius: "10px",
            boxShadow: "0px 10px 15px 5px rgba(0,0,0,0.15)",
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: "0.3rem" }}>{user.name}</p>
          <p style={{ color: "#7E7E7E", marginBottom: "1.2rem" }}>
            {user.email}
          </p>
          {/* <DropdownMenu.Item asChild>
            <Button
              onClick={() => navigate(`/profile/${user.id}/Published`)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            >
              Profile
            </Button>
          </DropdownMenu.Item> */}
          <DropdownMenu.Item asChild style={{ width: "100%" }}>
            <Button onClick={logout}>Logout</Button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export { ProfileNavbar };
