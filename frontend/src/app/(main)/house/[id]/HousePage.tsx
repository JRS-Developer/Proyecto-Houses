import { Button } from "@/components/ui/button";
import { House } from "@/types/house";
import { formatHousePrice } from "@/utils/houses";
import Image from "next/image";
import ContactSeller from "./_components/ContactSeller";

const getFeatures = (h: House) => {
  const features: {
    label: string;
    value: string | null;
  }[] = [];
  if (h.houseStyle) {
    const houseStyle: (typeof features)[number] = {
      label: "House Style",
      value: null,
    };

    switch (h.houseStyle) {
      case "1Story": {
        houseStyle.value = "One Story";
        break;
      }
      case "2Story": {
        houseStyle.value = "Two Story";
        break;
      }
      case "1.5Fin": {
        houseStyle.value = "One and a Half Story: 2nd Level Finished";
        break;
      }
      case "1.5Unf": {
        houseStyle.value = "One and a Half Story: 2nd Level Unfinished";
        break;
      }
      case "2.5Fin": {
        houseStyle.value = "Two and a Half Story: 2nd Level Finished";
        break;
      }
      case "2.5Unf": {
        houseStyle.value = "Two and a Half Story: 2nd Level Unfinished";
        break;
      }
      case "SFoyer": {
        houseStyle.value = "Split Foyer";
        break;
      }
      case "SLvl": {
        houseStyle.value = "Split Level";
        break;
      }
    }

    if (houseStyle.value) {
      features.push(houseStyle);
    }
  }

  if (h.yearBuilt) {
    features.push({
      label: "Year Built",
      value: h.yearBuilt.toString(),
    });
  }

  if (h.lotArea) {
    features.push({
      label: "Lot Area",
      value: Intl.NumberFormat("en-US", {
        style: "unit",
        unit: "foot",
      }).format(h.lotArea),
    });
  }

  if (h.utilities) {
    const utilitiles: (typeof features)[number] = {
      label: "Utilities",
      value: null,
    };

    switch (h.utilities) {
      case "AllPub": {
        utilitiles.value =
          "All public utilities (Electricity, Gas, Water & Sewer)";
        break;
      }
      case "NoSewr": {
        utilitiles.value = "Electricity, Gas, and Water (Septic Tank)";
        break;
      }
      case "NoSeWa": {
        utilitiles.value = "Electricity and Gas Only";
        break;
      }
      case "ELO": {
        utilitiles.value = "Electricity Only";
        break;
      }
    }

    if (utilitiles.value) {
      features.push(utilitiles);
    }
  }

  if (h.kitchenAbvGr) {
    features.push({
      label: "Kitchens",
      value: h.kitchenAbvGr.toString(),
    });
  }

  if (h.bedRoomAbvGr) {
    features.push({
      label: "Bedrooms",
      value: h.bedRoomAbvGr.toString(),
    });
  }

  return features;
};

export default function HousePage({
  house: h,
}: {
  house: House & {
    user: {
      id: number;
      firstName: string;
      lastName: string;
      image: string;
    };
  };
}) {
  const features = getFeatures(h);
  return (
    <div className="w-full py-12">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <Image
            alt="Hero"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last lg:aspect-square"
            height="550"
            src={h.image}
            width="550"
            priority
          />
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                {h.title}
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                This spacious house is located in a quiet neighborhood in the
                suburbs. It has 3 bedrooms, 2 bathrooms, and a large backyard.
              </p>
            </div>

            <div className="text-4xl font-bold">
              {formatHousePrice(h.salePrice)}
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <ContactSeller seller={h.user} />
            </div>
          </div>
        </div>
        {!!features.length && (
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6 ">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Key Features
                </h2>
                <ul className="grid gap-6 lg:grid-cols-2">
                  {features.map((f) => (
                    <li key={f.label}>
                      <div className="grid gap-1">
                        <h3 className="text-xl font-bold">{f.label}</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          {f.value}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
