export async function handle(state, action) {
  const input = action.input;

  if (input.function === "log_contribution") {
    const { txid } = input;

    _validateArTxSyntax(txid);
    const contributionData = await _validateAndGetContribution(txid);

    const caller = await _ownerToAddress(contributionData.owner);

    if (!(caller in state.leaderboard)) {
      state.leaderboard[caller] = contributionData.contribution;
      _sortLeaderboard();
      return { state };
    }

    state.leaderboard[caller] += contributionData.contribution;
    _sortLeaderboard();
    return { state };
  }

  function _validateArTxSyntax(txid) {
    ContractAssert(/[a-z0-9_-]{43}/i.test(txid), "ERROR_INVALID_ARWEAVE_TXID");
  }

  async function _ownerToAddress(pubkey) {
    try {
      const req = await EXM.deterministicFetch(
        `${state.molecule_endpoints.ota}/${pubkey}`,
      );
      const address = req.asJSON()?.address;
      _validateArTxSyntax(address);
      return address;
    } catch (error) {
      throw new ContractError("ERROR_MOLECULE_SERVER_ERROR");
    }
  }

  async function _validateAndGetContribution(txid) {
    try {
      ContractAssert(
        !state.contributions.includes(txid),
        "ERROR_CONTRIBUTION_ALREADY_LOGGED",
      );

      const txObject = (
        await EXM.deterministicFetch(`https://arweave.net/tx/${txid}`)
      )?.asJSON();
      ContractAssert(txObject?.reward, "ERROR_INVALID_TX");
      const contribution = Number(txObject?.reward);
      const owner = txObject.owner;
      ContractAssert(contribution * 1e-12 >= 0.25); // at least 0.25 AR contribution

      state.contributions.push(txid);

      return {
        contribution,
        owner,
      };
    } catch (error) {
      throw new ContractError("ERROR_FETCH_GATEWAY_DATA");
    }
  }

  function _sortLeaderboard() {
    const sorted = Object.fromEntries(
      Object.entries(state.leaderboard).sort(([, a], [, b]) => b - a),
    );

    state.leaderboard = sorted;
  }
}
