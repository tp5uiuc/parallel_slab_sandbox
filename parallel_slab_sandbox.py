def simulator(config, plot_times):
    # import sys

    # sys.path.extend(['/Users/tp5/code/parallel_slab'])
    from parallel_slab._driver import get_NeoHookeanSolution_data_from

    return get_NeoHookeanSolution_data_from(config.to_py(), plot_times.to_py())
