import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiMenuUp, mdiMenuDown, mdiPencil } from "@mdi/js";
import classNames from "classnames";

export type QueryFilter = {
  [key: string]: string | number | boolean;
};

export interface UpDownProps {
  name: string;
  sort: QueryFilter;
}

export default function UpDown(props: UpDownProps) {
  const [sort, setSort] = useState<QueryFilter>({});
  const [name, setName] = useState<String>();

  useEffect(() => {
    if (props.sort) {
      setSort(props.sort);
    }
  }, [props.sort]);

  useEffect(() => {
    if (props.name) {
      setName(props.name);
    }
  }, [props.name]);

  return (
    <div className="flex flex-col p-1 w-8">
      <div className="h-2">
        <Icon
          className={classNames(
            { hidden: sort.name != name || !sort.asc },
            "text-yellow-800"
          )}
          path={mdiMenuUp}
          title="ASC"
          size={0.9}
        />
      </div>
      <div className="h-2">
        <Icon
          className={classNames(
            { hidden: sort.name != name || sort.asc },
            "text-yellow-800"
          )}
          path={mdiMenuDown}
          title="DESC"
          size={0.9}
        />
      </div>
    </div>
  );
}
