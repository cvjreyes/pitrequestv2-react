import { Button, Input } from "../../general";

export default function CreateSoftware({
  createSubmit,
  formSoftware,
  handleChange,
  nameIsEmpty,
  codeIsEmpty,
  users,
}) {
  return (
    <form className="create_software" onSubmit={createSubmit}>
      <div className="inputs_software">
        <Input
          id="name"
          name="name"
          value={formSoftware.name}
          placeholder="Software"
          onChange={handleChange}
          error={nameIsEmpty ? "Required" : null}
        />
        <Input
          id="code"
          name="code"
          value={formSoftware.code}
          placeholder="Code"
          onChange={handleChange}
          error={codeIsEmpty ? "Required" : null}
        />
        <div className="selectContainer">
          <select
            name="adminId"
            value={formSoftware.adminId}
            onChange={handleChange}
          >
            <option value="">-- Select Admin --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <Button type="submit" onClick={createSubmit}>
          Create Software
        </Button>
      </div>
    </form>
  );
}
