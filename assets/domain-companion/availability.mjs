export class UnverifiedAvailabilityProvider {
  async check(domain) {
    return {
      domain,
      status: "unverified",
      label: "Disponibilité à vérifier",
      checkedAt: null
    };
  }
}

export const availabilityProvider = new UnverifiedAvailabilityProvider();
